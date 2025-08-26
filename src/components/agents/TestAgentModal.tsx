import React from 'react';
import { X } from 'lucide-react';
import PhoneFrame from '../ui/PhoneFrame';
import { ChatScreen } from '../chat/ChatScreen';
import { Agent } from '../../hooks/useAgents';

interface TestAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

const TestAgentModal: React.FC<TestAgentModalProps> = ({ isOpen, onClose, agent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="relative bg-white p-4 sm:p-8 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full p-1 z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className="w-full h-full overflow-hidden">
          <PhoneFrame>
            <ChatScreen agent={agent} />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
};

export default TestAgentModal;
