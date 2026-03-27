import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, User, Hash } from 'lucide-react';

export default function JoinRoom() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !roomId.trim() || !secretKey.trim()) return;
    
    // تمرير البيانات إلى صفحة الدردشة
    navigate('/chat', { state: { username, roomId, secretKey } });
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">دردشة سرية مشفرة</h1>
        <p className="text-gray-400 mt-2 text-sm">تشفير من طرف إلى طرف. لا أحد يستطيع قراءة رسائلك.</p>
      </div>

      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">اسمك (الاسم المستعار)</label>
          <div className="relative">
            <User className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="أدخل اسمك..."
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">معرف الغرفة (رقم أو اسم)</label>
          <div className="relative">
            <Hash className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="مثال: room123"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">كلمة سر التشفير (مفتاح فك التشفير)</label>
          <div className="relative">
            <Key className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              required
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="كلمة سر يتفق عليها الطرفان..."
            />
          </div>
          <p className="text-xs text-red-400 mt-2">ملاحظة: يجب أن يستخدم صديقك نفس كلمة السر ليتمكن من قراءة الرسائل.</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-6"
        >
          دخول الغرفة الآمنة
        </button>
      </form>
    </div>
  );
}