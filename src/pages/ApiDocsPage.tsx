import React, { useState } from 'react';
import { Copy, Check, Code, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';

const ApiDocsPage = () => {
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (text: string, id: any) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      endpoint: '/api/v1/send',
      description: 'Send a WhatsApp message',
      params: [
        { name: 'to', type: 'string', required: true, description: 'Recipient phone number' },
        { name: 'message', type: 'string', required: true, description: 'Message content' },
        { name: 'media_url', type: 'string', required: false, description: 'URL to media file' }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/v1/messages',
      description: 'Get message history',
      params: [
        { name: 'limit', type: 'number', required: false, description: 'Number of messages to return (default: 50)' },
        { name: 'offset', type: 'number', required: false, description: 'Offset for pagination' }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/v1/webhook',
      description: 'Set up webhook for incoming messages',
      params: [
        { name: 'url', type: 'string', required: true, description: 'Your webhook URL' },
        { name: 'events', type: 'array', required: false, description: 'Events to subscribe to' }
      ]
    }
  ];

  const CodeBlock = ({ code, language = 'json', id }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="text-sm text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-lg text-gray-600 mb-6">
          Complete reference for the Zapwize WhatsApp API. Build powerful messaging applications with our REST API.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-3" size={20} />
            <div>
              <h3 className="text-blue-800 font-medium mb-1">API Base URL</h3>
              <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded text-sm">https://api.zapwize.com</code>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
        <p className="text-gray-600 mb-4">
          All API requests require authentication using your API key. Include your API key in the Authorization header:
        </p>
        
        <CodeBlock 
          id="auth-header"
          code={`Authorization: Bearer your_api_key_here`}
          language="http"
        />
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Security Note:</strong> Never expose your API key in client-side code. Always make API calls from your server.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start</h2>
        <p className="text-gray-600 mb-4">Send your first message in under 5 minutes:</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">cURL Example</h3>
            <CodeBlock 
              id="curl-example"
              code={`curl -X POST "https://api.zapwize.com/api/v1/send" \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "message": "Hello from Zapwize!"
  }'`}
              language="bash"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">JavaScript Example</h3>
            <CodeBlock 
              id="js-example"
              code={`const response = await fetch('https://api.zapwize.com/api/v1/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Hello from Zapwize!'
  })
});

const data = await response.json();`}
              language="javascript"
            />
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Endpoints</h2>
        
        {endpoints.map((endpoint, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${
                endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {endpoint.method}
              </span>
              <code className="text-lg font-mono text-gray-900">{endpoint.endpoint}</code>
            </div>
            
            <p className="text-gray-600 mb-4">{endpoint.description}</p>
            
            <h4 className="text-md font-medium text-gray-900 mb-3">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Parameter</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Required</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.params.map((param, paramIndex) => (
                    <tr key={paramIndex} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-mono text-gray-900">{param.name}</td>
                      <td className="py-2 px-3 text-gray-600">{param.type}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          param.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {param.required ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-600">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Response Codes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Codes</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: '200', desc: 'Request successful' },
                { code: '400', desc: 'Bad request - invalid parameters' },
                { code: '401', desc: 'Unauthorized - invalid API key' },
                { code: '429', desc: 'Rate limit exceeded' },
                { code: '500', desc: 'Internal server error' }
              ].map((item, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-3 px-4 font-mono text-gray-900">{item.code}</td>
                  <td className="py-3 px-4 text-gray-600">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Limits</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Free Plan</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• 100 messages per day</li>
                <li>• 5 requests per minute</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pro Plan</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• 10,000 messages per day</li>
                <li>• 100 requests per minute</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SDK Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">SDKs & Libraries</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'Node.js SDK', lang: 'JavaScript' },
            { name: 'Python SDK', lang: 'Python' },
            { name: 'PHP SDK', lang: 'PHP' }
          ].map((sdk, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 mb-2">{sdk.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{sdk.lang}</p>
              <a href="#" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm">
                View on GitHub <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApiDocsPage;