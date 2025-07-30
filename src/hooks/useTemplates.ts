import { useState, useEffect } from 'react';

// Types
export type Template = {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: string;
  media?: {
    type: string;
    url: string;
    caption?: string;
  }[];
};

const mockTemplates: Template[] = [
  {
    id: 'template_1',
    name: 'New Year Greeting',
    content: 'Happy New Year, {{name}}!',
    variables: ['name'],
    category: 'marketing',
  },
  {
    id: 'template_2',
    name: 'Black Friday Sale',
    content: 'Our Black Friday sale is now live! Get 50% off all products.',
    variables: [],
    category: 'marketing',
  },
];

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const storedTemplates = localStorage.getItem('zapwize_templates');
    setTemplates(storedTemplates ? JSON.parse(storedTemplates) : mockTemplates);
  }, []);

  useEffect(() => {
    localStorage.setItem('zapwize_templates', JSON.stringify(templates));
  }, [templates]);

  const createTemplate = (data: Omit<Template, 'id'>): Promise<Template> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTemplate: Template = {
          ...data,
          id: `template_${Math.random().toString(36).substr(2, 9)}`,
        };
        setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
        resolve(newTemplate);
      }, 1000);
    });
  };

  return { templates, createTemplate };
};