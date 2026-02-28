import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import api from '../services/api';
import { FiSend, FiTrash2, FiWifiOff } from 'react-icons/fi';

const SUGGESTED_PROMPTS = [
  '🍛 Healthy Indian breakfast ideas',
  '💪 High protein vegetarian meals',
  '🔥 How to reduce belly fat with diet?',
  '🥗 Low calorie dinner recipes',
  '📊 Explain macronutrients simply',
  '🫘 Best iron-rich Indian foods',
];

/* ── Simple markdown → HTML ─────────────────────────── */
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // escape
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')                    // bold
    .replace(/\*(.+?)\*/g, '<em>$1</em>')                                // italic
    .replace(/`([^`]+)`/g, '<code>$1</code>')                            // inline code
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // lists: lines starting with - or * or •  or numbered
  html = html.replace(/^(?:[-*•] )(.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // paragraphs
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');

  return html;
}

export default function AiChat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState(null);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  /* Check Ollama status */
  useEffect(() => {
    api.get('/api/ai/status')
      .then((res) => setOllamaOnline(res.data?.ollamaAvailable ?? false))
      .catch(() => setOllamaOnline(false));
  }, []);

  /* Load chat history */
  useEffect(() => {
    api.get(`/api/ai/history?userId=${user.id}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length) {
          setMessages(res.data.map((m) => ({ id: m.id, role: m.role, content: m.content })));
        }
      })
      .catch(() => {});
  }, [user.id]);

  /* Auto-scroll */
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));

      const res = await api.post('/api/ai/chat', {
        message: msg,
        userId: user.id,
        history,
      });

      const reply = res.data?.reply || 'No response.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, I couldn\'t connect. Make sure Ollama is running.' },
      ]);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const deleteMessage = async (id, idx) => {
    if (id) {
      try { await api.delete(`/api/ai/history/${id}?userId=${user.id}`); } catch { /* skip */ }
    }
    setMessages((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearChat = async () => {
    try { await api.delete(`/api/ai/history?userId=${user.id}`); } catch { /* skip */ }
    setMessages([]);
    toast.success('Chat cleared');
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-500 flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-charcoal dark:text-dark-text">NutriBot AI</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${ollamaOnline ? 'bg-sage-500' : ollamaOnline === false ? 'bg-red-400' : 'bg-amber-400'} animate-pulse`} />
                <span className="text-[11px] text-brown-400 dark:text-dark-muted">
                  {ollamaOnline ? 'Online' : ollamaOnline === false ? 'Offline' : 'Checking…'}
                </span>
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="btn-ghost text-xs text-brown-400 hover:text-red-500">
              <FiTrash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Offline banner */}
        {ollamaOnline === false && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs flex-shrink-0">
            <FiWifiOff className="w-4 h-4" />
            <span>Ollama is offline. Run <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-[11px]">ollama serve</code> then pull <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-[11px]">llama3.2:3b</code></span>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
          {messages.length === 0 && !sending && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-16 h-16 rounded-2xl bg-sage-50 dark:bg-sage-500/10 flex items-center justify-center mb-4 text-3xl">🧠</div>
              <h3 className="text-base font-semibold text-charcoal dark:text-dark-text mb-1">Ask me anything about nutrition</h3>
              <p className="text-xs text-brown-400 dark:text-dark-muted mb-6 text-center max-w-sm">
                I can help with meal planning, nutrient info, Indian food suggestions, and dietary advice.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left px-4 py-3 rounded-xl text-xs font-medium text-brown-600 dark:text-dark-text bg-white dark:bg-dark-card border border-cream-300 dark:border-dark-border hover:border-sage-400 hover:shadow-soft transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`
                  relative max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded-2xl
                  ${msg.role === 'user'
                    ? 'bg-sage-500 text-white rounded-br-md'
                    : 'bg-white dark:bg-dark-card border border-cream-200 dark:border-dark-border text-charcoal dark:text-dark-text rounded-bl-md'}
                `}
              >
                {msg.role === 'assistant' ? (
                  <div
                    className="ai-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                ) : (
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                )}

                {/* Delete button on hover */}
                <button
                  onClick={() => deleteMessage(msg.id, i)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 text-red-500 items-center justify-center text-[10px] hidden group-hover:flex hover:bg-red-200 transition-colors"
                  title="Delete message"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-dark-card border border-cream-200 dark:border-dark-border rounded-2xl rounded-bl-md px-5 py-3.5 flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={chatEnd} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about nutrition, meals, or health…"
              className="flex-1 input py-3"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="btn-primary px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
