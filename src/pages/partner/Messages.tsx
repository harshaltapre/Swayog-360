import { useState } from 'react';
import { PageContainer } from '../../utils/htmlToReact';

interface Message {
  id: string;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isOnline: boolean;
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'contact', text: 'Hi! I wanted to follow up on the project status.', timestamp: '10:30 AM', read: true },
    { id: '2', sender: 'user', text: 'Hello! We\'re on schedule with installation completion by next week.', timestamp: '10:45 AM', read: true },
    { id: '3', sender: 'contact', text: 'Great! That sounds perfect for our timeline.', timestamp: '11:00 AM', read: true },
  ]);

  const conversations: Conversation[] = [
    { id: '1', name: 'Rajesh Gupta', avatar: '🧑‍💼', lastMessage: 'Great! That sounds perfect for our timeline.', lastMessageTime: '11:00 AM', unread: 0, isOnline: true },
    { id: '2', name: 'Priya Sharma', avatar: '👩‍💼', lastMessage: 'Thank you for the performance update', lastMessageTime: '2 hours ago', unread: 2, isOnline: true },
    { id: '3', name: 'Support Team', avatar: '🏢', lastMessage: 'Your documentation is complete', lastMessageTime: '1 day ago', unread: 0, isOnline: false },
    { id: '4', name: 'Finance Team', avatar: '💰', lastMessage: 'Invoice #123456 has been sent', lastMessageTime: '3 days ago', unread: 0, isOnline: false },
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const filteredConversations = conversations.filter(conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: true };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setIsTyping(false);
    }
  };

  return (
    <PageContainer title="Messages" subtitle="Communicate with your team and contacts">
      <div className="flex flex-col md:flex-row gap-4 min-h-screen md:h-[600px] bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
        <div className="w-full md:w-96 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <input type="text" placeholder="🔍 Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div key={conv.id} onClick={() => setSelectedConversation(conv.id)} className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-blue-50/30 ${selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-[#1A365D]' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="text-2xl">{conv.avatar}</div>
                    {conv.isOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#48BB78] rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-900 text-sm">{conv.name}</p>
                      <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && <span className="inline-flex items-center justify-center w-5 h-5 bg-[#48BB78] text-white text-xs font-bold rounded-full flex-shrink-0">{conv.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedConv && (
          <div className="flex md:flex flex-1 flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{selectedConv.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedConv.name}</p>
                  <p className="text-xs text-gray-500">{selectedConv.isOnline ? '🟢 Active now' : '⚪ Offline'}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 text-xl hover:bg-gray-100 p-2 rounded">⋮</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-md text-sm ${msg.sender === 'user' ? 'bg-[#1A365D] text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span>{selectedConv.name} is typing</span>
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => { setNewMessage(e.target.value); setIsTyping(e.target.value.length > 0); }} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm" />
                <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded text-lg">📎</button>
                <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-6 py-2 bg-[#1A365D] text-white rounded-sm hover:bg-[#1A365D]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
