import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  HelpCircle,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { aiService } from '../../services/aiService';

export default function ActiveSimulation({ scenario, onEndSimulation, onExit }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-initial',
      sender: 'bot',
      text: scenario.initialMessage,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState(scenario.suggestedResponses || []);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // Handle sending a message
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isBotTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsBotTyping(true);

    try {
      const response = await aiService.sendDigitalTwinMessage(scenario, newHistory, text);
      setIsBotTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: response.text,
          timestamp: 'Just now',
        },
      ]);
      if (response.suggestedFollowUps && response.suggestedFollowUps.length > 0) {
        setSuggestedReplies(response.suggestedFollowUps);
      }
    } catch (e) {
      console.error('Digital twin response error:', e);
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-210px)] min-h-[550px] bg-white rounded-3xl border border-zinc-200/90 shadow-lg overflow-hidden font-sans">
      {/* Simulation Top Bar */}
      <div className="p-4 sm:p-5 bg-zinc-950 text-white flex items-center justify-between gap-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Exit without debrief"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">{scenario.characterName}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {scenario.role}
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Scenario: {scenario.title} · <span className="text-amber-400">{scenario.difficulty} Level</span>
            </p>
          </div>
        </div>

        {/* Action: End & Reveal Debrief */}
        <button
          onClick={() => onEndSimulation(messages)}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-200" />
          <span>End & Reveal Debrief</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-zinc-50/50">
        {/* Scenario Objective Notice */}
        <div className="p-3 rounded-2xl bg-zinc-100/80 border border-zinc-200/60 text-xs text-zinc-600 flex items-center justify-between gap-2">
          <span>Goal: Chat with the persona. Spot the scam tactics and protect your money and passwords.</span>
          <span className="font-mono text-[10px] text-zinc-400 shrink-0">SIMULATED BOT</span>
        </div>

        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-1`}
            >
              <span className="text-[10px] font-mono text-zinc-400 px-1">
                {isBot ? scenario.characterName : 'You'}
              </span>
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isBot
                    ? 'bg-white text-zinc-900 border border-zinc-200/80 rounded-tl-sm'
                    : 'bg-zinc-950 text-white rounded-tr-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* Bot Typing Indicator */}
        {isBotTyping && (
          <div className="flex items-center gap-2 p-3.5 bg-white border border-zinc-200/70 rounded-2xl w-fit shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-300" />
            <span className="text-xs text-zinc-400 font-mono ml-1">{scenario.characterName} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Response Pills (For Users Unsure of What to Say) */}
      {suggestedReplies && suggestedReplies.length > 0 && !isBotTyping && (
        <div className="p-3 bg-zinc-100/70 border-t border-zinc-200/60 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-mono text-zinc-400 uppercase shrink-0 pl-1">Suggested Options:</span>
          {suggestedReplies.map((sug, idx) => {
            const isRisky = sug.type === 'risky';
            const isSafe = sug.type === 'safe';

            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.text)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${
                  isRisky
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                    : isSafe
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200'
                }`}
              >
                {sug.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Message Input Composer */}
      <div className="p-3 sm:p-4 bg-white border-t border-zinc-200 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Reply to ${scenario.characterName} (or click a suggested reply above)...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-sans"
            disabled={isBotTyping}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isBotTyping}
            className={`p-3 rounded-2xl font-bold transition-all cursor-pointer shrink-0 ${
              !inputValue.trim() || isBotTyping
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-xs'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
