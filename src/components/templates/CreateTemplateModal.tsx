import { useState, FormEvent } from 'react';
import { X, Image, Video, Mic, File } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import WhatsAppPreview from './WhatsAppPreview';
import Button from '../ui/Button';

type MediaType = 'image' | 'video' | 'audio' | 'document';

type MediaContent = {
  id: string;
  type: MediaType;
  url: string;
  name: string;
  caption?: string;
};

type CreateTemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    content: string;
    variables: string[];
    category: 'marketing' | 'support' | 'notifications';
    media: MediaContent[];
  }) => Promise<void>;
};

const CreateTemplateModal = ({ isOpen, onClose, onSubmit }: CreateTemplateModalProps) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'marketing' | 'support' | 'notifications'>('support');
  const [media, setMedia] = useState<MediaContent[]>([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    content?: string;
    media?: string;
    url?: string;
  }>({});

  // Extract variables from content (text between {{ and }})
  const extractVariables = (text: string): string[] => {
    const matches = text.match(/{{([^}]+)}}/g) || [];
    return matches.map(match => match.slice(2, -2));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Template name is required';
      isValid = false;
    }

    if (!content.trim() && media.length === 0) {
      newErrors.content = 'Either message content or media is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddMedia = (type: MediaType) => {
    if (!mediaUrl.trim()) {
      setErrors({ ...errors, url: 'Please enter a valid URL' });
      return;
    }

    setMedia([...media, {
      id: uuidv4(),
      type,
      url: mediaUrl,
      name: `Sample ${type}`,
      caption: mediaCaption,
    }]);

    // Reset form
    setMediaUrl('');
    setMediaCaption('');
    setErrors({});
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        await onSubmit({
          name: name.trim(),
          content: content.trim(),
          variables: extractVariables(content),
          category,
          media,
        });
        
        // Reset form
        setName('');
        setContent('');
        setCategory('support');
        setMedia([]);
        setErrors({});
        onClose();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="flex justify-between items-start p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Create Message Template
            </h3>
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Template Name
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

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as typeof category)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="marketing">Marketing</option>
                      <option value="support">Support</option>
                      <option value="notifications">Notifications</option>
                    </select>
                  </div>

                  {/* Media Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Media
                    </label>
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Enter media URL"
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          className={`block w-full px-3 py-2 border ${
                            errors.url ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                        />
                        {errors.url && (
                          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Media caption (optional)"
                          value={mediaCaption}
                          onChange={(e) => setMediaCaption(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Button
                          type="button"
                          onClick={() => handleAddMedia('image')}
                          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                        >
                          <Image size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-600">Add Image</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleAddMedia('video')}
                          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                        >
                          <Video size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-600">Add Video</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleAddMedia('audio')}
                          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                        >
                          <Mic size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-600">Add Audio</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleAddMedia('document')}
                          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                        >
                          <File size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-600">Add Document</span>
                        </Button>
                      </div>
                    </div>

                    {/* Media Preview */}
                    {media.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {media.map((item) => (
                          <div key={item.id} className="flex items-start p-2 border rounded-lg">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-3">
                              {item.type === 'image' && <Image size={20} className="text-gray-500" />}
                              {item.type === 'video' && <Video size={20} className="text-gray-500" />}
                              {item.type === 'audio' && <Mic size={20} className="text-gray-500" />}
                              {item.type === 'document' && <File size={20} className="text-gray-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              {item.caption && (
                                <p className="text-sm text-gray-500 truncate">{item.caption}</p>
                              )}
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleRemoveMedia(item.id)}
                              className="ml-2 text-gray-400 hover:text-gray-500"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Message Content
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="content"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={`block w-full px-3 py-2 border ${
                          errors.content ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                        placeholder="Use {{variable}} for dynamic content&#10;Example: Hi {{name}}, thank you for your order!"
                      />
                    </div>
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Variables detected: {extractVariables(content).join(', ') || 'none'}
                    </p>
                  </div>
                </form>
              </div>

              {/* Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
                <WhatsAppPreview
                  content={content}
                  variables={extractVariables(content).reduce((acc, variable) => ({
                    ...acc,
                    [variable]: `[${variable}]`
                  }), {})}
                  media={media}
                />
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <Button
              type="submit"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create Template
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;