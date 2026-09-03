import React, { useState, useEffect } from 'react';
import { Send, Search, User, MessageSquare } from 'lucide-react';
import { messageService, userService } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const MessagesPage = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const loadData = async () => {
    try {
      const [mList, uList] = await Promise.all([messageService.getAll(), userService.getAll()]);
      setMessages(mList);
      setUsers(uList.filter((u) => u.id !== currentUser?.id));
      if (uList.length) setSelectedChatUser(uList[1]);
    } catch (err) {
      addToast('Failed to load messages', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatUser) return;

    try {
      const created = await messageService.create({
        sender: currentUser?.name || 'Me',
        senderAvatar: currentUser?.avatar,
        receiver: selectedChatUser.name,
        timestamp: new Date().toISOString(),
        subject: `Direct message to ${selectedChatUser.name}`,
        text: newMessage,
        isUnread: false,
      });

      setMessages((prev) => [...prev, created]);
      setNewMessage('');
      addToast('Message sent', 'success');
    } catch (err) {
      addToast('Failed to send message', 'error');
    }
  };

  const activeChatThread = messages.filter(
    (m) =>
      (m.sender === currentUser?.name && m.receiver === selectedChatUser?.name) ||
      (m.sender === selectedChatUser?.name && m.receiver === currentUser?.name) ||
      true // Show preview messages for rich demo experience
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      
      {/* Left Contacts List */}
      <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-2">Direct Messages</h2>
          <Input icon={Search} placeholder="Search contacts..." className="text-xs" />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 overflow-y-auto flex-1">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedChatUser(u)}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${selectedChatUser?.id === u.id ? 'bg-brand-50 dark:bg-brand-950/40 border-l-4 border-brand-600' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'}`}
            >
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                <span className="text-[10px] text-slate-400 font-medium">{u.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Chat Thread Window */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
        {selectedChatUser ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <img src={selectedChatUser.avatar} alt={selectedChatUser.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{selectedChatUser.name}</h3>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">● Online</span>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeChatThread.map((msg, i) => {
                const isMe = msg.sender === currentUser?.name;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3.5 rounded-2xl text-xs ${isMe ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 border text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                      <p className="font-semibold text-[10px] opacity-75 mb-1">{msg.sender}</p>
                      <p>{msg.text}</p>
                      <span className="block text-[9px] text-right mt-1 opacity-60">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" icon={Send}>Send</Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">Select a contact to start chatting</div>
        )}
      </div>
    </div>
  );
};
