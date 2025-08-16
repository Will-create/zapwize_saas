import React, { useState } from 'react';
import { 
  Book, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Filter, 
  Play,
  Code,
  Smartphone,
  Bot,
  MessageCircle,
  Zap,
  BarChart,
  Users
} from 'lucide-react';

const TutorialsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tutorials', icon: Book },
    { id: 'quickstart', name: 'Quick Start', icon: Zap },
    { id: 'integration', name: 'Integration', icon: Code },
    { id: 'automation', name: 'Automation', icon: Bot },
    { id: 'analytics', name: 'Analytics', icon: BarChart },
    { id: 'advanced', name: 'Advanced', icon: Users }
  ];

  const tutorials = [
    {
      id: 1,
      title: "Send Your First WhatsApp Message",
      description: "Learn how to send your first WhatsApp message using the Zapwize API in under 10 minutes.",
      category: "quickstart",
      difficulty: "beginner",
      duration: "10 min",
      author: "Zapwize Team",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
      tags: ["API", "Getting Started", "WhatsApp"],
      steps: [
        "Create your Zapwize account",
        "Get your API key",
        "Make your first API call",
        "Verify message delivery"
      ]
    },
    {
      id: 2,
      title: "Building a Customer Support Bot",
      description: "Create an intelligent customer support bot that can handle common inquiries automatically.",
      category: "automation",
      difficulty: "intermediate",
      duration: "45 min",
      author: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=200&fit=crop",
      tags: ["AI Bot", "Customer Support", "Automation"],
      steps: [
        "Set up bot triggers",
        "Create response templates",
        "Configure AI responses",
        "Test and deploy"
      ]
    },
    {
      id: 3,
      title: "Integrating with Shopify for Order Updates",
      description: "Send automated WhatsApp notifications to customers when their Shopify orders are updated.",
      category: "integration",
      difficulty: "intermediate",
      duration: "30 min",
      author: "Mike Chen",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      tags: ["Shopify", "E-commerce", "Webhooks"],
      steps: [
        "Configure Shopify webhooks",
        "Set up Zapwize endpoint",
        "Create message templates",
        "Test order notifications"
      ]
    },
    {
      id: 4,
      title: "Sending Media Files and Documents",
      description: "Learn how to send images, videos, PDFs and other media files through WhatsApp.",
      category: "quickstart",
      difficulty: "beginner",
      duration: "15 min",
      author: "Lisa Wang",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop",
      tags: ["Media", "Files", "API"],
      steps: [
        "Upload media to cloud storage",
        "Format media API requests",
        "Send different media types",
        "Handle media responses"
      ]
    },
    {
      id: 5,
      title: "Advanced Analytics and Reporting",
      description: "Set up comprehensive analytics to track message performance and user engagement.",
      category: "analytics",
      difficulty: "advanced",
      duration: "60 min",
      author: "David Rodriguez",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      tags: ["Analytics", "Reporting", "Data"],
      steps: [
        "Configure tracking webhooks",
        "Set up analytics dashboard",
        "Create custom reports",
        "Export data for analysis"
      ]
    },
    {
      id: 6,
      title: "Building a Multi-Language Support System",
      description: "Create a system that automatically detects customer language and responds appropriately.",
      category: "advanced",
      difficulty: "advanced",
      duration: "90 min",
      author: "Anna Kowalski",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&h=200&fit=crop",
      tags: ["Internationalization", "AI", "Language Detection"],
      steps: [
        "Set up language detection",
        "Create multilingual templates",
        "Configure auto-translation",
        "Test with different languages"
      ]
    },
    {
      id: 7,
      title: "WhatsApp Business Profile Setup",
      description: "Optimize your WhatsApp Business profile for better customer engagement and trust.",
      category: "quickstart",
      difficulty: "beginner",
      duration: "20 min",
      author: "Tom Wilson",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
      tags: ["Business Profile", "Branding", "Setup"],
      steps: [
        "Configure business information",
        "Upload profile photo and cover",
        "Set business hours",
        "Add catalog and services"
      ]
    },
    {
      id: 8,
      title: "Handling Webhooks and Real-time Events",
      description: "Master webhook implementation for real-time message handling and event processing.",
      category: "integration",
      difficulty: "intermediate",
      duration: "40 min",
      author: "Jennifer Lee",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop",
      tags: ["Webhooks", "Real-time", "Events"],
      steps: [
        "Configure webhook endpoints",
        "Handle different event types",
        "Implement security validation",
        "Debug webhook issues"
      ]
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tutorials & Guides</h1>
        <p className="text-lg text-gray-600 mb-6">
          Step-by-step tutorials to help you master the Zapwize platform and build amazing WhatsApp integrations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTutorials.map(tutorial => (
          <div key={tutorial.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Tutorial Image */}
            <div className="relative">
              <img 
                src={tutorial.image} 
                alt={tutorial.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                  {tutorial.difficulty}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                <Play size={14} className="mr-1" />
                {tutorial.duration}
              </div>
            </div>

            {/* Tutorial Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tutorial.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tutorial.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Steps Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">What you'll learn:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tutorial.steps.slice(0, 2).map((step, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {step}
                    </li>
                  ))}
                  {tutorial.steps.length > 2 && (
                    <li className="text-gray-500 text-xs">+ {tutorial.steps.length - 2} more steps</li>
                  )}
                </ul>
              </div>

              {/* Author and CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <User size={14} className="mr-1" />
                  {tutorial.author}
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm font-medium">
                  Start Tutorial
                  <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTutorials.length === 0 && (
        <div className="text-center py-12">
          <Book size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search terms or filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
          Our team is constantly creating new tutorials. Request a specific tutorial or get personalized help from our experts.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Request Tutorial
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;