import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { Upload, File, Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface Document {
  name: string;
  size: string;
  date: string;
  status: 'indexed' | 'unindexed' | 'uploading';
  url?: string;
}

const KnowledgeBaseTab = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([
    { name: 'document1.pdf', size: '1.2 MB', date: '2023-10-27', status: 'indexed' },
    { name: 'document2.csv', size: '5.6 MB', date: '2023-10-26', status: 'indexed' },
    { name: 'document3.docx', size: '0.8 MB', date: '2023-10-25', status: 'unindexed' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    const newDocument: Document = {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      date: new Date().toISOString().split('T')[0],
      status: 'uploading',
    };

    setDocuments(prev => [newDocument, ...prev]);

    try {
      // --- This is a placeholder for the actual upload logic ---
      // In a real app, you would get the userId and token from your auth context/storage
      const userId = 'user123'; 
      const token = 'mef2xo4lX33b59pfnupmk1n5akjjrrc8me';
      const uploadUrl = `https://fs.zapwize.com/upload/${userId}/?token=${token}`;

      const formData = new FormData();
      formData.append('file', file);

      // Using axios as it's already in the project
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // --- End of placeholder ---

      // Assuming the response contains the URL of the uploaded file
      const uploadedFileUrl = response.data.url; 

      // Now, you would save this URL to your backend
      await saveDocumentUrlToBackend(uploadedFileUrl, file.name);

      setDocuments(prev =>
        prev.map(doc =>
          doc.name === file.name ? { ...doc, status: 'unindexed', url: uploadedFileUrl } : doc
        )
      );

    } catch (error) {
      console.error('File upload failed:', error);
      setDocuments(prev => prev.filter(doc => doc.name !== file.name));
      // You would also show an error toast to the user
    }
  };

  const saveDocumentUrlToBackend = async (url: string, name: string) => {
    // This is a placeholder for the actual backend call
    console.log('Saving to backend:', { name, url });
    // Example using the api service structure:
    // await makeApiReq('agents_knowledgebase_add', { agentId: 'your-agent-id', name, url });
    return new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.knowledgeBase.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.knowledgeBase.description')}</p>
      </div>

      <div className="flex justify-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="outline" onClick={triggerFileInput}>
          <Upload className="mr-2 h-4 w-4" />
          {t('agents.edit.knowledgeBase.upload')}
        </Button>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('agents.edit.knowledgeBase.indexNow')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.knowledgeBase.columns.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.knowledgeBase.columns.size')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.knowledgeBase.columns.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.knowledgeBase.columns.status')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.knowledgeBase.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{doc.size}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{doc.date}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.status === 'indexed' ? 'bg-green-100 text-green-800' :
                      doc.status === 'unindexed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800 animate-pulse'
                    }`}>
                      {t(`agents.edit.knowledgeBase.status.${doc.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="icon" disabled={doc.status === 'uploading'}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseTab;
