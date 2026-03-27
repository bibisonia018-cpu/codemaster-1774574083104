import { Routes, Route } from 'react-router-dom';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md md:max-w-2xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <Routes>
          <Route path="/" element={<JoinRoom />} />
          <Route path="/chat" element={<ChatRoom />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;