import { useState, useRef, ChangeEvent } from 'react';
import { Paperclip, Image, Video, File, Mic, Send, Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

type ChatInputProps = {
  onSendMessage: (content: string, type: 'text' | 'image' | 'video' | 'audio' | 'document', file?: File) => void;
};

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, type: 'document' | 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage('', type, file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <Smile size={20} />
          </button>

          <div className="relative group">
            <button className="text-gray-500 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
              <Paperclip size={20} />
            </button>
            
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
              <div className="bg-white rounded-lg shadow-lg py-2 w-48">
                <button
                  onClick={() => mediaInputRef.current?.click()}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Image size={16} className="mr-2" />
                  Photos
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Video size={16} className="mr-2" />
                  Videos
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <File size={16} className="mr-2" />
                  Documents
                </button>
              </div>
            </div>
          </div>

          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          {message.trim() ? (
            <button
              onClick={handleSendMessage}
              className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full"
            >
              <Send size={20} />
            </button>
          ) : (
            <button
              onClick={handleVoiceRecord}
              className={`p-2 rounded-full ${
                isRecording 
                  ? 'text-red-500 bg-red-100' 
                  : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mic size={20} />
            </button>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'document')}
        />
        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'image')}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'video')}
        />
      </div>
    </div>
  );
};

export default ChatInput;