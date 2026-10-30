import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Coins,
  Calendar,
  Users
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

export const SmartAssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    assistantMessages,
    sendAssistantQuery,
    clearAssistantChat,
    executeAssistantAction,
    currentUser,
    activeRole,
  } = useHR();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [assistantMessages, isAssistantOpen]);

  if (!isAssistantOpen) return null;

  const isEmployee = activeRole === 'employee';

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendAssistantQuery(inputVal.trim());
    setInputVal('');
  };

  const quickPrompts = isEmployee
    ? [
        'Summarize my attendance this month',
        'Check my remaining leave balances',
        'Summarize my latest payslip',
        'Status of my leave applications',
        'View my profile credentials',
      ]
    : [
        'Full organization executive summary',
        'Summarize today\'s attendance turnout',
        'Check pending leave requests',
        'Monthly payroll & base wages',
        'Recruitment pipeline status',
      ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-96 max-w-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">
                {isEmployee ? 'My Portal Helper' : 'Executive Copilot'}
              </h3>
              <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] font-semibold rounded">
                {isEmployee ? 'Personal Scoped' : 'Enterprise'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isEmployee ? 'Personal HR & Attendance Intelligence' : 'Autonomous HR & Workforce Intelligence'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearAssistantChat}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-100 overflow-x-auto">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 px-1">
          Suggested Queries
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendAssistantQuery(prompt)}
              className="text-left text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-md text-slate-700 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
        {assistantMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Interactive Action Buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    {msg.quickActions.map((qa) => (
                      <button
                        key={qa.actionKey}
                        onClick={() => executeAssistantAction(qa.actionKey, qa.payload)}
                        className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-left"
                      >
                        <span>{qa.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 px-1 font-mono">{msg.timestamp}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about attendance, salaries, OKRs..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors shrink-0 shadow-xs shadow-blue-200"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
