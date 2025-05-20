import { useState, FormEvent, useRef } from 'react';
import { X, Upload, Download, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

type Template = {
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

type Contact = {
  phoneNumber: string;
  [key: string]: string;
};

type CreateCampaignModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    templateId: string;
    schedule: Date | null;
    contacts: Contact[];
  }) => void;
  templates: Template[];
};

const CreateCampaignModal = ({ isOpen, onClose, onSubmit, templates }: CreateCampaignModalProps) => {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [schedule, setSchedule] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    templateId?: string;
    contacts?: string;
    schedule?: string;
  }>({});
  const [previewContact, setPreviewContact] = useState<Contact | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTemplate = templates.find(t => t.id === templateId);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Campaign name is required';
      isValid = false;
    }

    if (!templateId) {
      newErrors.templateId = 'Please select a template';
      isValid = false;
    }

    if (contacts.length === 0) {
      newErrors.contacts = 'Please upload contacts';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedContacts = results.data as Contact[];
        
        // Validate contacts
        const invalidContacts = parsedContacts.filter(contact => !contact.phoneNumber);
        if (invalidContacts.length > 0) {
          setErrors({
            ...errors,
            contacts: 'Some contacts are missing phone numbers'
          });
          return;
        }

        setContacts(parsedContacts);
        setPreviewContact(parsedContacts[0]);
        setErrors({
          ...errors,
          contacts: undefined
        });
      },
      error: () => {
        setErrors({
          ...errors,
          contacts: 'Failed to parse CSV file'
        });
      }
    });
  };

  const downloadSampleCSV = () => {
    if (!selectedTemplate) return;

    const headers = ['phoneNumber', ...selectedTemplate.variables];
    const sampleData = [
      headers.join(','),
      ['+1234567890', ...selectedTemplate.variables.map(v => `[${v}]`)].join(',')
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_contacts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        templateId,
        schedule: schedule ? new Date(schedule) : null,
        contacts,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-start p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Create New Campaign
            </h3>
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="space-y-4">
                {/* Campaign Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Template Selection */}
                <div>
                  <label htmlFor="templateId" className="block text-sm font-medium text-gray-700">
                    Message Template
                  </label>
                  <select
                    id="templateId"
                    value={templateId}
                    onChange={(e) => {
                      setTemplateId(e.target.value);
                      setContacts([]); // Reset contacts when template changes
                      setPreviewContact(null);
                    }}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                      errors.templateId ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md`}
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  {errors.templateId && (
                    <p className="mt-1 text-sm text-red-600">{errors.templateId}</p>
                  )}
                </div>

                {/* Schedule */}
                <div>
                  <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
                    Schedule (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    id="schedule"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                {/* Contacts Upload */}
                {selectedTemplate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Contacts
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Upload size={16} className="mr-2" />
                        Upload CSV
                      </button>
                      <button
                        type="button"
                        onClick={downloadSampleCSV}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Download size={16} className="mr-2" />
                        Download Sample
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                    {errors.contacts && (
                      <p className="mt-1 text-sm text-red-600">{errors.contacts}</p>
                    )}
                    {contacts.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {contacts.length} contacts loaded
                      </div>
                    )}
                  </div>
                )}

                {/* Preview */}
                {selectedTemplate && previewContact && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2 text-sm text-gray-500">
                        <AlertCircle size={16} className="mr-1" />
                        Preview for: {previewContact.phoneNumber}
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        {selectedTemplate.media?.map((media, index) => (
                          <div key={index} className="mb-2">
                            {media.type === 'image' && (
                              <img src={media.url} alt="" className="rounded-lg max-h-32 object-cover" />
                            )}
                            {media.caption && (
                              <p className="text-sm text-gray-600 mt-1">{media.caption}</p>
                            )}
                          </div>
                        ))}
                        <p className="text-sm">
                          {selectedTemplate.content.replace(/{{([^}]+)}}/g, (_, variable) => 
                            previewContact[variable] || `[${variable}]`
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Create Campaign
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;