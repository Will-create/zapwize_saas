import { useState } from 'react';
import { Battery, Signal, Wifi, ChevronLeft, MoreVertical, Phone, Video, Paperclip, Mic, Send, Image, File } from 'lucide-react';

type MediaContent = {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  caption?: string;
};

type WhatsAppPreviewProps = {
  content: string;
  variables: Record<string, string>;
  media?: MediaContent[];
};

const WhatsAppPreview = ({ content, variables, media = [] }: WhatsAppPreviewProps) => {
  const [time] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  });

  // Replace variables in content with their values
  const processedContent = content.replace(/{{([^}]+)}}/g, (match, variable) => 
    variables[variable] || match
  );

  const renderMediaPreview = (item: MediaContent) => {
    switch (item.type) {
      case 'image':
        return (
          <div className="mb-2 rounded-lg overflow-hidden">
            <img src={item.url} alt={item.name} className="w-full h-48 object-cover" />
            {item.caption && (
              <div className="text-sm mt-1">{item.caption}</div>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="mb-2 rounded-lg overflow-hidden bg-black">
            <video src={item.url} controls className="w-full h-48 object-contain" />
            {item.caption && (
              <div className="text-sm mt-1">{item.caption}</div>
            )}
          </div>
        );
      case 'audio':
        return (
          <div className="mb-2 flex items-center bg-white rounded-lg p-3">
            <Mic size={20} className="text-gray-500 mr-2" />
            <audio src={item.url} controls className="w-full" />
          </div>
        );
      case 'document':
        return (
          <div className="mb-2 flex items-center bg-white rounded-lg p-3">
            <File size={20} className="text-gray-500 mr-2" />
            <div className="flex-1 truncate">
              <div className="text-sm font-medium">{item.name}</div>
              {item.caption && (
                <div className="text-xs text-gray-500">{item.caption}</div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[320px] mx-auto bg-gray-100 rounded-3xl overflow-hidden shadow-lg">
      {/* Phone Status Bar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between text-white text-xs">
        <span>{time}</span>
        <div className="flex items-center space-x-1">
          <Signal size={12} />
          <Wifi size={12} />
          <Battery size={12} />
        </div>
      </div>

      {/* WhatsApp Header */}
      <div className="bg-green-600 text-white p-2">
        <div className="flex items-center">
          <ChevronLeft size={24} />
          <div className="h-8 w-8 bg-gray-300 rounded-full mr-2"></div>
          <div className="flex-1">
            <div className="font-medium">Business Name</div>
            <div className="text-xs opacity-80">online</div>
          </div>
          <div className="flex items-center space-x-3">
            <Video size={20} />
            <Phone size={20} />
            <MoreVertical size={20} />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-[#E5DDD5] h-96 p-4 space-y-2 overflow-y-auto">
        {/* System Message */}
        <div className="flex justify-center">
          <div className="bg-white rounded px-2 py-1 text-xs text-gray-500">
            Messages are end-to-end encrypted
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex justify-end">
          <div className="bg-[#DCF8C6] rounded-lg px-3 py-2 max-w-[80%] shadow-sm">
            {media.map((item) => renderMediaPreview(item))}
            {processedContent && (
              <div className="text-sm">{processedContent}</div>
            )}
            <div className="text-right mt-1">
              <span className="text-xs text-gray-500">{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gray-200 p-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 border-none focus:outline-none text-sm bg-transparent"
              disabled
            />
            <div className="flex items-center space-x-2 text-gray-500">
              <Paperclip size={20} />
            </div>
          </div>
          <button className="bg-green-600 text-white p-2 rounded-full">
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreview;