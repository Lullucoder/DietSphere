import { useState, useRef, useEffect } from 'react';
import { FiSend, FiLoader, FiMessageCircle } from 'react-icons/fi';
import api from '../services/api';

export default function AiChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post(`/ai/chat?userId=${user.id}`, { message: input });
      const aiMsg = { role: 'assistant', content: data.response || data.message || 'No response' };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I could not respond.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">AI Nutrition Assistant</h1>

      <div className="flex-1 card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FiMessageCircle className="w-10 h-10 mx-auto mb-3" />
              <p>Ask me anything about nutrition!</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-md' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-2 rounded-2xl rounded-bl-md">
                <div className="loading-spinner w-4 h-4" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Ask about nutrition..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button onClick={send} disabled={loading || !input.trim()} className="btn-primary px-4">
              {loading ? <FiLoader className="animate-spin w-4 h-4" /> : <FiSend className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
