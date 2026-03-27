import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import { Send, LogOut, ShieldCheck } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: any;
}

export default function ChatRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { username: string; roomId: string; secretKey: string };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // التأكد من وجود البيانات
    if (!state || !state.username || !state.roomId || !state.secretKey) {
      navigate('/');
      return;
    }

    // جلب الرسائل في الوقت الفعلي من الغرفة المحددة
    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', state.roomId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // فك تشفير الرسالة محلياً بمجرد وصولها
        const decryptedText = decryptMessage(data.text, state.secretKey);
        
        msgs.push({
          id: doc.id,
          text: decryptedText,
          sender: data.sender,
          createdAt: data.createdAt,
        });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [state, navigate]);

  // التمرير التلقائي لأسفل عند وصول رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const textToSend = newMessage;
    setNewMessage(''); // تفريغ الحقل مباشرة لتجربة مستخدم سلسة

    try {
      // تشفير الرسالة قبل إرسالها لقاعدة البيانات
      const encryptedText = encryptMessage(textToSend, state.secretKey);
      
      await addDoc(collection(db, 'messages'), {
        roomId: state.roomId,
        text: encryptedText,
        sender: state.username,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('حدث خطأ أثناء إرسال الرسالة.');
    }
  };

  if (!state) return null;

  return (
    <div className="flex flex-col h-[85vh] md:h-[600px]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-white font-bold flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-500" />
            غرفة: {state.roomId}
          </h2>
          <p className="text-xs text-gray-400 mt-1">متصل كـ: {state.username}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="text-red-400 hover:text-red-300 transition flex items-center gap-1 text-sm bg-red-400/10 px-3 py-1.5 rounded-lg"
        >
          <LogOut size={16} />
          خروج
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            لا توجد رسائل حتى الآن. كن أول من يرسل!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === state.username;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-700 text-gray-100 rounded-tl-none'
                  }`}
                >
                  {!isMe && (
                    <span className="text-xs font-bold text-gray-400 block mb-1">
                      {msg.sender}
                    </span>
                  )}
                  <p className="whitespace-pre-wrap break-words text-sm md:text-base">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك السرية هنا..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-full py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-700 text-white rounded-full p-3 transition flex items-center justify-center"
          >
            <Send size={20} className="transform rotate-180" /> {/* تدوير الأيقونة لتدعم الاتجاه العربي */}
          </button>
        </div>
      </form>
    </div>
  );
}