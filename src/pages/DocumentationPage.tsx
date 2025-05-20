import { FileText, ExternalLink, Book, Code, MessageCircle, HelpCircle } from 'lucide-react';

const DocumentationPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        <p className="text-gray-600 mt-1">Browse our API documentation and integration guides</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* API Reference Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Code size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">API Reference</h3>
            <p className="text-gray-500 mb-4">
              Comprehensive API documentation with endpoints, parameters, and response examples.
            </p>
            <a
              href="https://zapwize.com/docs/api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View API Reference
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* Getting Started Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Book size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-500 mb-4">
              Learn how to quickly set up and integrate Zapwize in your applications.
            </p>
            <a
              href="https://zapwize.com/docs/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Read Guides
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* Tutorial Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <FileText size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tutorials</h3>
            <p className="text-gray-500 mb-4">
              Step-by-step tutorials for common WhatsApp integration scenarios.
            </p>
            <a
              href="https://zapwize.com/docs/tutorials"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              View Tutorials
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* SDKs Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
              <Code size={24} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">SDKs & Libraries</h3>
            <p className="text-gray-500 mb-4">
              Official client libraries for various programming languages.
            </p>
            <a
              href="https://zapwize.com/docs/sdks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Explore SDKs
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* Examples Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
              <Code size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Code Examples</h3>
            <p className="text-gray-500 mb-4">
              Ready-to-use code samples for common use cases in multiple languages.
            </p>
            <a
              href="https://zapwize.com/docs/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              View Examples
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* Help & Support Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <HelpCircle size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Help & Support</h3>
            <p className="text-gray-500 mb-4">
              Get help from our team or connect with the community.
            </p>
            <a
              href="https://zapwize.com/support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Get Support
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Video Tutorial Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="flex items-center justify-center h-full">
                <MessageCircle size={32} className="text-gray-400" />
                <span className="ml-2 text-gray-500">Tutorial Video</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Getting Started with Zapwize</h3>
              <p className="text-gray-500 text-sm mt-1">Learn the basics in under 5 minutes</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="flex items-center justify-center h-full">
                <MessageCircle size={32} className="text-gray-400" />
                <span className="ml-2 text-gray-500">Tutorial Video</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Setting Up Webhooks</h3>
              <p className="text-gray-500 text-sm mt-1">Configure webhooks for real-time updates</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="flex items-center justify-center h-full">
                <MessageCircle size={32} className="text-gray-400" />
                <span className="ml-2 text-gray-500">Tutorial Video</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Building a WhatsApp Bot</h3>
              <p className="text-gray-500 text-sm mt-1">Create automated responses with our API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;