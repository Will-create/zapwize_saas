import { useTranslation } from 'react-i18next';
import { FileText, ExternalLink, Book, Code, MessageCircle, HelpCircle } from 'lucide-react';

const DocumentationPage = () => {
  const { t } = useTranslation('documentation');

  const cards = [
    {
      icon: Code,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: t('docs.apiTitle'),
      description: t('docs.apiDescription'),
      link: "documentation/api",
      linkText: t('docs.apiLinkText')
    },
    {
      icon: Book,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: t('docs.gettingStartedTitle'),
      description: t('docs.gettingStartedDescription'),
      link: "documentation/getting-started",
      linkText: t('docs.gettingStartedLinkText')
    },
    {
      icon: FileText,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      title: t('docs.tutorialsTitle'),
      description: t('docs.tutorialsDescription'),
      link: "documentation/tutorials",
      linkText: t('docs.tutorialsLinkText')
    },
    {
      icon: Code,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: t('docs.sdksTitle'),
      description: t('docs.sdksDescription'),
      link: "documentation/sdks",
      linkText: t('docs.sdksLinkText')
    },
    {
      icon: Code,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      title: t('docs.examplesTitle'),
      description: t('docs.examplesDescription'),
      link: "documentation/examples",
      linkText: t('docs.examplesLinkText')
    },
    {
      icon: HelpCircle,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: t('docs.helpTitle'),
      description: t('docs.helpDescription'),
      link: "support",
      linkText: t('docs.helpLinkText')
    }
  ];
  const videos = [
    { title: t('docs.video1Title'), description: t('docs.video1Description') },
    { title: t('docs.video2Title'), description: t('docs.video2Description') },
    { title: t('docs.video3Title'), description: t('docs.video3Description') },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('pageTitle')}</h1>
        <p className="text-gray-600 mt-1">{t('pageDescription')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className={`flex items-center justify-center w-12 h-12 ${card.bgColor} rounded-lg mb-4`}>
                  <Icon size={24} className={card.iconColor} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-500 mb-4">{card.description}</p>
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center ${card.iconColor} hover:text-opacity-80 font-medium`}
                >
                  {card.linkText}
                  <ExternalLink size={16} className="ml-1" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('videoTutorialsTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                <MessageCircle size={32} className="text-gray-400" />
                <span className="ml-2 text-gray-500">{t('tutorialVideoLabel')}</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{video.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
