import { useState } from 'react';
import { format } from 'date-fns';
import { Play, Pause, Download, ExternalLink, File as FileIcon } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import type { Message } from '../../services/mockChats';

type MessageBubbleProps = {
  message: Message;
  isUser: boolean;
};

const MessageBubble = ({ message, isUser }: MessageBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(false);

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="break-words">{message.content}</p>;

      case 'image':
        return (
          <div className="space-y-1">
            <div className="relative">
              <img
                src={message.mediaUrl}
                alt=""
                className="rounded-lg max-h-48 object-cover cursor-pointer"
                onClick={() => setShowMediaPreview(true)}
              />
              <button 
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                onClick={() => window.open(message.mediaUrl, '_blank')}
              >
                <ExternalLink size={16} />
              </button>
            </div>
            {message.caption && (
              <p className="text-sm break-words">{message.caption}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-1">
            <div className="relative">
              <video
                src={message.mediaUrl}
                controls
                className="rounded-lg max-h-48 w-full"
              />
              <button 
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                onClick={() => window.open(message.mediaUrl, '_blank')}
              >
                <Download size={16} />
              </button>
            </div>
            {message.caption && (
              <p className="text-sm break-words">{message.caption}</p>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-gray-100"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex-1 h-12 bg-gray-100 rounded">
              {/* WaveSurfer will be initialized here */}
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download size={20} />
            </button>
          </div>
        );

      case 'document':
        return (
          <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
            <FileIcon size={24} className="text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.content}</p>
              {message.caption && (
                <p className="text-xs text-gray-500 truncate">{message.caption}</p>
              )}
            </div>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Download size={20} />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] sm:max-w-lg rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-green-500 text-white'
            : 'bg-white text-gray-900'
        }`}
      >
        {renderContent()}
        
        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className={`text-xs ${
            isUser ? 'text-green-100' : 'text-gray-500'
          }`}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          
          {message.reactions.length > 0 && (
            <div className="flex -space-x-1">
              {message.reactions.map((reaction, index) => (
                <span
                  key={index}
                  className="inline-block bg-white rounded-full px-2 py-1 text-xs shadow"
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Preview Modal */}
      {showMediaPreview && message.type === 'image' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl mx-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setShowMediaPreview(false)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={message.mediaUrl}
              alt=""
              className="max-h-[90vh] w-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;