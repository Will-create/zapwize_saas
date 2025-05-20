import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageSquare, Bot, Zap, Globe, Shield, ChevronRight, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t('landing.features.messaging.title'),
      description: t('landing.features.messaging.description'),
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: t('landing.features.ai.title'),
      description: t('landing.features.ai.description'),
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t('landing.features.automation.title'),
      description: t('landing.features.automation.description'),
    },
  ];

  const testimonials = [
    {
      quote: t('landing.testimonials.quote1'),
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp Inc.",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    },
    {
      quote: t('landing.testimonials.quote2'),
      author: "Michael Chen",
      role: "E-commerce Manager",
      company: "Global Retail",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    },
    {
      quote: t('landing.testimonials.quote3'),
      author: "Emma Davis",
      role: "Customer Success",
      company: "ServicePro",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Zapwize</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/documentation" className="text-gray-600 hover:text-gray-900">
                {t('common.documentation')}
              </Link>
              <div className="relative">
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="appearance-none bg-transparent pr-8 py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
                <Globe className="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  {t('auth.signIn')}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/documentation"
                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                {t('common.documentation')}
              </Link>
              <div className="px-4 py-2">
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="block w-full py-2 text-base text-gray-600 bg-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {t('auth.signIn')}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative bg-white pt-16 pb-32 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="text-center lg:text-left lg:col-span-12 xl:col-span-6">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">{t('landing.hero.title1')}</span>
                <span className="block text-green-600">{t('landing.hero.title2')}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                {t('landing.hero.description')}
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    {t('landing.hero.cta')}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-12 hidden xl:block xl:mt-0 xl:col-span-6">
              <div className="relative mx-auto w-full rounded-lg shadow-lg">
                <img
                  className="w-full rounded-lg"
                  src="https://images.pexels.com/photos/7439135/pexels-photo-7439135.jpeg"
                  alt="Dashboard preview"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        initial={{ opacity: 0, y: 20 }}
        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('landing.features.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center pt-6"
                >
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 w-full">
                    <div className="-mt-6">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg text-white">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        ref={testimonialsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('landing.testimonials.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="px-6 py-8">
                    <div className="flex flex-col items-center">
                      <img
                        className="h-16 w-16 rounded-full"
                        src={testimonial.image}
                        alt={testimonial.author}
                      />
                      <div className="mt-4 text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                    <p className="mt-6 text-base text-gray-500">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-8">
              <span className="block">{t('landing.cta.title')}</span>
              <span className="block text-green-200 mt-2">{t('landing.cta.subtitle')}</span>
            </h2>
            <div className="flex justify-center">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                >
                  {t('landing.cta.button')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {t('landing.footer.product')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/documentation" className="text-base text-gray-500 hover:text-gray-900">
                    {t('common.documentation')}
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-base text-gray-500 hover:text-gray-900">
                    {t('landing.footer.pricing')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {t('landing.footer.company')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                    {t('landing.footer.about')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    {t('landing.footer.contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {t('landing.footer.legal')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    {t('landing.footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    {t('landing.footer.terms')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {t('landing.footer.social')}
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="https://twitter.com" className="text-base text-gray-500 hover:text-gray-900">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" className="text-base text-gray-500 hover:text-gray-900">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} Zapwize. {t('landing.footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;