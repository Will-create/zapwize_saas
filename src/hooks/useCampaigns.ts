import { useState, useEffect } from 'react';

// Types
export type Campaign = {
  id: string;
  name: string;
  templateId: string;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  schedule: Date | null;
  createdAt: string;
  contactCount: number;
  sentCount: number;
  failedCount: number;
};

const mockCampaigns: Campaign[] = [
  {
    id: 'camp_1',
    name: 'New Year Promotion',
    templateId: 'template_1',
    status: 'sent',
    schedule: new Date('2025-01-01T10:00:00Z'),
    createdAt: '2024-12-28T14:00:00Z',
    contactCount: 5000,
    sentCount: 4995,
    failedCount: 5,
  },
  {
    id: 'camp_2',
    name: 'Black Friday Deals',
    templateId: 'template_2',
    status: 'draft',
    schedule: null,
    createdAt: '2025-11-20T11:00:00Z',
    contactCount: 10000,
    sentCount: 0,
    failedCount: 0,
  },
];

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const storedCampaigns = localStorage.getItem('zapwize_campaigns');
    setCampaigns(storedCampaigns ? JSON.parse(storedCampaigns) : mockCampaigns);
  }, []);

  useEffect(() => {
    localStorage.setItem('zapwize_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const createCampaign = (data: Omit<Campaign, 'id' | 'createdAt' | 'status' | 'sentCount' | 'failedCount'>): Promise<Campaign> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCampaign: Campaign = {
          ...data,
          id: `camp_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          status: 'draft',
          sentCount: 0,
          failedCount: 0,
        };
        setCampaigns(prevCampaigns => [...prevCampaigns, newCampaign]);
        resolve(newCampaign);
      }, 1000);
    });
  };

  return { campaigns, createCampaign };
};