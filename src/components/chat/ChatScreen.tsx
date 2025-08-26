import { useState } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Message } from '../../services/mockChats';
import { Agent } from '../../hooks/useAgents';

interface ChatScreenProps {
  agent: Agent;
}

export const ChatScreen = ({ agent }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      content: `Hello! I'm ${agent.name}. How can I help you today?`,
      senderId: 'agent',
      timestamp: new Date().toISOString(),
      status: 'read',
      reactions: [],
    },
  ]);

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'video' | 'audio' | 'document', file?: File) => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      type: type,
      content: type === 'text' ? content : file?.name || '',
      senderId: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: [],
      mediaUrl: file ? URL.createObjectURL(file) : undefined,
    };
    setMessages([...messages, newMessage]);

    // Simulate agent response
    if (type === 'text') {
        setTimeout(() => {
            const agentResponse: Message = {
                id: String(messages.length + 2),
                type: 'text',
                content: `This is a simulated response from ${agent.name}.`,
                senderId: 'agent',
                timestamp: new Date().toISOString(),
                status: 'read',
                reactions: [],
            };
            setMessages(prev => [...prev, agentResponse]);
        }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
        <div className="bg-white p-4 border-b border-gray-200 flex items-center">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="Agent" className="w-10 h-10 rounded-full mr-4" />
            <div>
                <h2 className="font-semibold">{agent.name}</h2>
                <p className="text-sm text-gray-500">Online</p>
            </div>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isUser={msg.senderId === 'user'}
          />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};