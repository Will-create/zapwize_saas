import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Play, Copy, Check, AlertCircle, Smartphone, Key, MessageCircle } from 'lucide-react';

const GettingStartedPage = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  const toggleStep = (stepInde: string) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter(i => i !== stepIndex));
    } else {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeBlock = ({ code: string, language = 'bash', id: string }) => (
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

  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up for a free Zapwize account to get started",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Create your account to access the Zapwize dashboard and get your API credentials.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="text-blue-600 mr-2" size={16} />
              <span className="text-blue-800 font-medium">What you'll get:</span>
            </div>
            <ul className="text-blue-700 text-sm space-y-1 ml-6">
              <li>• Free tier with 100 messages per month</li>
              <li>• Access to dashboard and analytics</li>
              <li>• API key for development</li>
              <li>• WhatsApp Business API sandbox</li>
            </ul>
          </div>
          <div className="mt-4">
            <a href="/register" className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Sign Up Now <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
        </div>
      )
    },
    {
      title: "Get Your API Key",
      description: "Navigate to the API Keys section and generate your first key",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Your API key is required for all API requests. Keep it secure and never share it publicly.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Steps to get your API key:</h4>
            <ol className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3">1</span>
                Go to Dashboard → API Keys
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3">2</span>
                Click "Generate New Key"
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3">3</span>
                Copy and securely store your key
              </li>
            </ol>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Your API key will only be shown once. Store it in a secure location like environment variables.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Set Up Your Phone Number",
      description: "Connect a WhatsApp Business number to start sending messages",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            You'll need a dedicated phone number for WhatsApp Business API. This number will be used to send and receive messages.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-green-800 font-medium mb-2">Sandbox Number (Testing)</h4>
              <p className="text-green-700 text-sm">Use our sandbox number for development and testing. No setup required!</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-blue-800 font-medium mb-2">Production Number</h4>
              <p className="text-blue-700 text-sm">Connect your own WhatsApp Business number for live messaging.</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Quick Setup with Sandbox:</h4>
            <ol className="text-gray-600 space-y-1 text-sm">
              <li>1. Go to Dashboard → Numbers</li>
              <li>2. Select "Use Sandbox Number"</li>
              <li>3. Send a test message to verify connection</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Send Your First Message",
      description: "Use the API to send your first WhatsApp message",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Now let's send your first message using the API. Here's a simple example:
          </p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Using cURL:</h4>
            <CodeBlock 
              id="first-message-curl"
              code={`curl -X POST "https://api.zapwize.com/api/v1/send" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "message": "Hello! This is my first message from Zapwize 🎉"
  }'`}
            />
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Using JavaScript:</h4>
            <CodeBlock 
              id="first-message-js"
              language="javascript"
              code={`const sendMessage = async () => {
  try {
    const response = await fetch('https://api.zapwize.com/api/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer your_api_key_here',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: '+1234567890',
        message: 'Hello! This is my first message from Zapwize 🎉'
      })
    });

    const result = await response.json();
    console.log('Message sent:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

sendMessage();`}
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Success!</strong> If you see a 200 response, your message was sent successfully. Check your WhatsApp to see it delivered.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Set Up Webhooks (Optional)",
      description: "Receive incoming messages and delivery confirmations",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Webhooks allow you to receive real-time notifications when messages are delivered or when you receive replies.
          </p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Configure your webhook endpoint:</h4>
            <CodeBlock 
              id="webhook-setup"
              code={`curl -X POST "https://api.zapwize.com/api/v1/webhook" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yourapp.com/webhook",
    "events": ["message.delivered", "message.received", "message.read"]
  }'`}
            />
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Example webhook handler (Node.js):</h4>
            <CodeBlock 
              id="webhook-handler"
              language="javascript"
              code={`app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  
  switch(event) {
    case 'message.received':
      console.log('New message:', data.message);
      // Handle incoming message
      break;
    case 'message.delivered':
      console.log('Message delivered:', data.message_id);
      // Update message status
      break;
  }
  
  res.status(200).send('OK');
});`}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Tip:</strong> Use tools like ngrok for local testing or set up a simple endpoint on platforms like Vercel or Netlify.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Explore Advanced Features",
      description: "Learn about media messages, templates, and automation",
      content: (
        <div>
          <p className="text-gray-600 mb-6">
            Once you've mastered the basics, explore these advanced features to build powerful messaging applications:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Smartphone className="text-green-600 mr-2" size={20} />
                <h4 className="font-medium text-gray-900">Media Messages</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">Send images, documents, videos, and audio files.</p>
              <a href="/dashboard/documentation" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Learn more →
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <MessageCircle className="text-blue-600 mr-2" size={20} />
                <h4 className="font-medium text-gray-900">Message Templates</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">Create reusable message templates for common use cases.</p>
              <a href="/dashboard/documentation" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Learn more →
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Key className="text-purple-600 mr-2" size={20} />
                <h4 className="font-medium text-gray-900">Automation</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">Set up automated responses and workflow triggers.</p>
              <a href="/dashboard/ai-bot" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Learn more →
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Play className="text-red-600 mr-2" size={20} />
                <h4 className="font-medium text-gray-900">Campaigns</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">Send bulk messages and track campaign performance.</p>
              <a href="/dashboard/campaigns" className="text-red-600 hover:text-red-700 text-sm font-medium">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Getting Started with Zapwize</h1>
        <p className="text-lg text-gray-600 mb-6">
          Follow this step-by-step guide to get up and running with the Zapwize WhatsApp API in minutes.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-green-800 font-medium mb-2">What you'll learn:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• How to set up your Zapwize account</li>
            <li>• Getting your API credentials</li>
            <li>• Sending your first WhatsApp message</li>
            <li>• Setting up webhooks for two-way communication</li>
            <li>• Exploring advanced features</li>
          </ul>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
          <span className="text-sm text-gray-600">
            {completedSteps.length} of {steps.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="flex items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleStep(index)}
            >
              <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors ${
                  completedSteps.includes(index) 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {completedSteps.includes(index) ? (
                    <CheckCircle size={20} />
                  ) : (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
              <ArrowRight 
                size={20} 
                className={`text-gray-400 transition-transform ${
                  completedSteps.includes(index) ? 'rotate-90' : ''
                }`} 
              />
            </div>
            
            {completedSteps.includes(index) && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  {step.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h2>
        <p className="text-green-100 mb-6">
          You're now ready to start building powerful WhatsApp integrations with Zapwize. Here are some resources to help you go further:
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <a 
            href="/dashboard/documentation" 
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all"
          >
            <h3 className="font-medium mb-2">API Reference</h3>
            <p className="text-sm text-green-100">Complete API documentation with examples</p>
          </a>
          
          <a 
            href="/dashboard/api-keys" 
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all"
          >
            <h3 className="font-medium mb-2">Manage API Keys</h3>
            <p className="text-sm text-green-100">Create and manage your API credentials</p>
          </a>
          
          <a 
            href="/dashboard/ai-bot" 
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all"
          >
            <h3 className="font-medium mb-2">AI Bot Builder</h3>
            <p className="text-sm text-green-100">Create intelligent automated responses</p>
          </a>
        </div>
      </div>

      {/* Support */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Need help getting started?</p>
        <div className="flex justify-center space-x-4">
          <a 
            href="/support" 
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            Contact Support <ArrowRight size={16} className="ml-1" />
          </a>
          <span className="text-gray-300">|</span>
          <a 
            href="/dashboard/documentation" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View Full Documentation <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage;