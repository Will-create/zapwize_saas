import { format } from 'date-fns';

// Types
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  senderId: string;
  mediaUrl?: string;
  caption?: string;
  reactions: Array<{
    emoji: string;
    userId: string;
  }>;
  // For audio messages
  duration?: number;
  waveform?: number[];
}

export interface Conversation {
  id: string;
  contactId: string;
  contactPhone: string;
  contactName: string | null;
  profilePicUrl: string | null;
  lastMessage: Message;
  unreadCount: number;
  lastSeen: string;
  pinned: boolean;
  muted: boolean;
  backgroundUrl: string; // Added background image URL
}

// Mock data
export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    contactId: 'contact1',
    contactPhone: '+1-23****89',
    contactName: 'John Doe',
    profilePicUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    lastMessage: {
      id: 'msg4',
      type: 'text',
      content: 'When will the shipment arrive?',
      timestamp: '2025-05-10T09:43:12Z',
      status: 'read',
      senderId: 'contact1',
      reactions: []
    },
    unreadCount: 0,
    lastSeen: '2025-05-10T09:45:00Z',
    pinned: false,
    muted: false,
    backgroundUrl: 'https://images.pexels.com/photos/7130498/pexels-photo-7130498.jpeg'
  },
  {
    id: 'conv2',
    contactId: 'contact2',
    contactPhone: '+4-45****21',
    contactName: 'Sarah Wilson',
    profilePicUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    lastMessage: {
      id: 'msg3',
      type: 'image',
      content: 'Photo',
      mediaUrl: 'https://images.pexels.com/photos/1059122/pexels-photo-1059122.jpeg',
      caption: 'Check this out',
      timestamp: '2025-05-10T08:30:00Z',
      status: 'delivered',
      senderId: 'user',
      reactions: []
    },
    unreadCount: 2,
    lastSeen: '2025-05-09T22:15:00Z',
    pinned: true,
    muted: false,
    backgroundUrl: 'https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg'
  },
  {
    id: 'conv3',
    contactId: 'contact3',
    contactPhone: '+8-12****45',
    contactName: 'Mike Johnson',
    profilePicUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    lastMessage: {
      id: 'msg_audio1',
      type: 'audio',
      content: 'Voice message',
      mediaUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav',
      timestamp: '2025-05-10T10:15:00Z',
      status: 'delivered',
      senderId: 'contact3',
      reactions: [],
      duration: 45,
      waveform: Array.from({ length: 50 }, () => Math.random())
    },
    unreadCount: 1,
    lastSeen: '2025-05-10T10:00:00Z',
    pinned: false,
    muted: false,
    backgroundUrl: 'https://images.pexels.com/photos/7130537/pexels-photo-7130537.jpeg'
  }
];

export const mockMessages: Record<string, Message[]> = {
  'conv1': [
    {
      id: 'msg1',
      type: 'text',
      content: 'Hello, I wanted to ask about my order #ZW-5643',
      timestamp: '2025-05-10T09:30:00Z',
      status: 'read',
      senderId: 'contact1',
      reactions: []
    },
    {
      id: 'msg2',
      type: 'text',
      content: 'Hi there! I can help you with that. Let me check the status.',
      timestamp: '2025-05-10T09:35:00Z',
      status: 'read',
      senderId: 'user',
      reactions: [
        { emoji: '👍', userId: 'contact1' }
      ]
    },
    {
      id: 'msg3',
      type: 'document',
      content: 'Order_Details.pdf',
      mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      caption: 'Here are your order details',
      timestamp: '2025-05-10T09:37:00Z',
      status: 'read',
      senderId: 'user',
      reactions: []
    },
    {
      id: 'msg4',
      type: 'text',
      content: 'When will the shipment arrive?',
      timestamp: '2025-05-10T09:43:12Z',
      status: 'read',
      senderId: 'contact1',
      reactions: []
    }
  ],
  'conv2': [
    {
      id: 'msg1',
      type: 'text',
      content: 'Do you have this product in blue?',
      timestamp: '2025-05-10T08:15:00Z',
      status: 'read',
      senderId: 'contact2',
      reactions: []
    },
    {
      id: 'msg2',
      type: 'text',
      content: 'Yes, we do have it in blue! Here\'s an image:',
      timestamp: '2025-05-10T08:20:00Z',
      status: 'read',
      senderId: 'user',
      reactions: []
    },
    {
      id: 'msg3',
      type: 'image',
      mediaUrl: 'https://images.pexels.com/photos/1059122/pexels-photo-1059122.jpeg',
      caption: 'Check this out',
      timestamp: '2025-05-10T08:30:00Z',
      status: 'delivered',
      senderId: 'user',
      reactions: [
        { emoji: '❤️', userId: 'contact2' }
      ]
    },
    {
      id: 'msg4',
      type: 'video',
      mediaUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
      caption: 'Product demo video',
      timestamp: '2025-05-10T08:35:00Z',
      status: 'delivered',
      senderId: 'user',
      reactions: []
    }
  ],
  'conv3': [
    {
      id: 'msg1',
      type: 'audio',
      content: 'Voice message',
      mediaUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav',
      timestamp: '2025-05-10T10:00:00Z',
      status: 'read',
      senderId: 'contact3',
      reactions: [],
      duration: 30,
      waveform: Array.from({ length: 50 }, () => Math.random())
    },
    {
      id: 'msg2',
      type: 'text',
      content: 'I\'ll check this and get back to you',
      timestamp: '2025-05-10T10:05:00Z',
      status: 'read',
      senderId: 'user',
      reactions: []
    },
    {
      id: 'msg3',
      type: 'document',
      content: 'Specifications.pdf',
      mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      caption: 'Here are the specifications',
      timestamp: '2025-05-10T10:10:00Z',
      status: 'delivered',
      senderId: 'user',
      reactions: []
    },
    {
      id: 'msg_audio1',
      type: 'audio',
      content: 'Voice message',
      mediaUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav',
      timestamp: '2025-05-10T10:15:00Z',
      status: 'delivered',
      senderId: 'contact3',
      reactions: [],
      duration: 45,
      waveform: Array.from({ length: 50 }, () => Math.random())
    }
  ]
};