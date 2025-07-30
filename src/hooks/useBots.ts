import { useState, useEffect } from 'react';

// Types
export type Bot = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'draft';
  whatsappNumber: string;
  createdAt: string;
  messageCount: number;
  successRate: number;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
  }>;
  tokenUsage: {
    total: number;
    remaining: number;
    resetDate: string;
  };
};

const mockBots: Bot[] = [
  {
    id: 'bot_1',
    name: 'Customer Support Bot',
    status: 'active',
    whatsappNumber: '+1234567890',
    createdAt: '2025-02-20T10:00:00Z',
    messageCount: 1250,
    successRate: 95.5,
    documents: [
      {
        id: 'doc_1',
        name: 'Product Manual.pdf',
        type: 'pdf',
        size: 2500000,
      },
      {
        id: 'doc_2',
        name: 'FAQs.txt',
        type: 'text',
        size: 15000,
      },
    ],
    tokenUsage: {
      total: 1000000,
      remaining: 750000,
      resetDate: '2025-03-20T00:00:00Z',
    },
  },
  {
    id: 'bot_2',
    name: 'Sales Assistant',
    status: 'inactive',
    whatsappNumber: '+9876543210',
    createdAt: '2025-02-15T15:30:00Z',
    messageCount: 850,
    successRate: 88.2,
    documents: [
      {
        id: 'doc_3',
        name: 'Price List.xlsx',
        type: 'spreadsheet',
        size: 500000,
      },
    ],
    tokenUsage: {
      total: 500000,
      remaining: 200000,
      resetDate: '2025-03-15T00:00:00Z',
    },
  },
];

export const useBots = () => {
  const [bots, setBots] = useState<Bot[]>([]);

  useEffect(() => {
    const storedBots = localStorage.getItem('zapwize_bots');
    setBots(storedBots ? JSON.parse(storedBots) : mockBots);
  }, []);

  useEffect(() => {
    localStorage.setItem('zapwize_bots', JSON.stringify(bots));
  }, [bots]);

  const createBot = (data: Omit<Bot, 'id' | 'createdAt' | 'messageCount' | 'successRate' | 'documents' | 'tokenUsage'>): Promise<Bot> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBot: Bot = {
          ...data,
          id: `bot_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          status: 'draft',
          messageCount: 0,
          successRate: 0,
          documents: [],
          tokenUsage: {
            total: 100000,
            remaining: 100000,
            resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        };
        setBots(prevBots => [...prevBots, newBot]);
        resolve(newBot);
      }, 1000);
    });
  };

  const toggleBotStatus = (botId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setBots(prevBots =>
          prevBots.map(bot =>
            bot.id === botId
              ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
              : bot
          )
        );
        resolve();
      }, 500);
    });
  };

  const deleteBot = (botId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
        resolve();
      }, 500);
    });
  };

  return { bots, createBot, toggleBotStatus, deleteBot };
};