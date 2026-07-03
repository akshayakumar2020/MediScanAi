import { useState, useRef, useEffect } from 'react';
import chatService from '../../services/chatService';
import './UserPages.css';

const initialMessages = [
  {
    id: 1, sender: 'bot',
    text: "Hello! I'm your MediScan AI assistant. I can help explain your medical reports, answer health questions, or guide you through the platform. How can I assist you today?",
    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  },
];

const ChatAssistant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), text: input, sender: 'user', timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await chatService.sendMessage(input);
      const botResponse = {
        id: Date.now() + 1,
        text: res.data?.message || res.data || "Sorry, I didn't get that.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error("Chat error", err);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Health Assistant</h1>
          <p className="page-subtitle">Ask health questions and get AI-powered guidance</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-icon">🤖</div>
          <div>
            <div className="chat-header-title">MediScan AI Assistant</div>
            <div className="chat-header-subtitle">Online • Typically responds instantly</div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="chat-msg-avatar">
                {msg.sender === 'bot' ? '🤖' : '👤'}
              </div>
              <div className="chat-msg-bubble">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot">
              <div className="chat-msg-avatar">🤖</div>
              <div className="chat-msg-bubble">Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            placeholder="Ask a health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
