import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiCpu, FiAlertCircle, FiTrash2, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../services/api'
import Layout from '../components/Layout'

const SUGGESTED_PROMPTS = [
  { emoji: '🥗', text: 'What should I eat for dinner to balance my nutrients?' },
  { emoji: '💪', text: 'Am I getting enough protein today?' },
  { emoji: '🍳', text: 'Suggest a healthy Indian breakfast' },
  { emoji: '📊', text: 'Analyze my diet and give recommendations' },
  { emoji: '🥜', text: 'What are good vegetarian protein sources?' },
  { emoji: '🔥', text: 'How many more calories should I eat today?' },
]

function AiChat({ user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ollamaStatus, setOllamaStatus] = useState(null) // null = checking, true/false
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { checkOllamaStatus() }, [])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const checkOllamaStatus = async () => {
    try {
      const res = await api.get('/api/ai/status')
      setOllamaStatus(res.data.ollamaAvailable)
    } catch {
      setOllamaStatus(false)
    }
  }

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      // Build conversation history (last 10 messages for context window)
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await api.post('/api/ai/chat', {
        message: userMsg,
        userId: user.userId,
        history
      })

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      const errorMsg = err.response?.data?.reply || 'Failed to get a response. Is Ollama running?'
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, isError: true }])
      toast.error('AI request failed')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Chat cleared')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FiCpu size={18} className="text-white" />
            </div>
            NutriBot
          </h1>
          <p className="text-sm text-slate-500 mt-1">AI-powered nutrition assistant — knows your today's meals</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            ollamaStatus === null
              ? 'border-slate-200 text-slate-400 bg-slate-50'
              : ollamaStatus
                ? 'border-green-200 text-green-700 bg-green-50'
                : 'border-red-200 text-red-600 bg-red-50'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              ollamaStatus === null ? 'bg-slate-300 animate-pulse' : ollamaStatus ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {ollamaStatus === null ? 'Checking...' : ollamaStatus ? 'Ollama Online' : 'Ollama Offline'}
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all" title="Clear chat">
              <FiTrash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Offline Banner */}
      {ollamaStatus === false && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200"
        >
          <div className="flex gap-3">
            <FiAlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Ollama is not running</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Start Ollama on your machine to use the AI assistant.
                Open a terminal and run:
              </p>
              <div className="mt-2 space-y-1">
                <code className="block text-xs bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg font-mono">ollama serve</code>
                <code className="block text-xs bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg font-mono">ollama pull llama3.2:3b</code>
              </div>
              <button onClick={checkOllamaStatus} className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2">
                Re-check connection
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col" style={{ height: 'calc(100vh - 260px)', minHeight: '400px' }}>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
                <FiZap size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Hi, I'm NutriBot!</h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                I can analyze your meals, suggest foods to balance your diet, and answer any nutrition questions. I already know what you've eaten today!
              </p>

              {/* Suggested prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => sendMessage(prompt.text)}
                    className="text-left px-3.5 py-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/50 transition-all text-sm text-slate-600 group"
                  >
                    <span className="mr-2">{prompt.emoji}</span>
                    <span className="group-hover:text-brand-700 transition-colors">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <FiCpu size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-br-md'
                      : msg.isError
                        ? 'bg-red-50 text-red-700 border border-red-100 rounded-bl-md'
                        : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-md'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold text-slate-600 uppercase">
                      {user?.username?.substring(0, 2) || '??'}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <FiCpu size={14} className="text-white" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-100 px-4 sm:px-6 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NutriBot anything about your diet..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
              style={{ maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                input.trim() && !loading
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FiSend size={16} className={loading ? 'animate-pulse' : ''} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            NutriBot uses your logged meals for context · Powered by Ollama · Not medical advice
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default AiChat
