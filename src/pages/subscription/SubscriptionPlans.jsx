import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCrown,
  faStar,
  faGem,
  faCheck,
  faEnvelope,
  faUsers,
  faHeart,
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import ModernLayout from '../../components/layout/ModernLayout';
import { ModernButton } from '../../components';
import { useTheme } from '../../hooks/redux';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { theme } = useTheme();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: faUsers,
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      color: 'gray',
      features: [
        'Up to 10 AI generations (lifetime)',
        'Upload unlimited artworks',
        'Create unlimited posts',
        'Basic community features',
        'Standard support'
      ],
      limitations: [
        'Limited AI generations',
        'No priority support'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      icon: faStar,
      price: '$9.99',
      period: 'month',
      description: 'For active creators',
      color: 'blue',
      features: [
        'Up to 50 AI generations (lifetime)',
        'Upload unlimited artworks',
        'Create unlimited posts',
        'Priority support',
        'Advanced analytics',
        'Custom themes'
      ],
      limitations: [
        'Standard AI generation speed'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: faCrown,
      price: '$19.99',
      period: 'month',
      description: 'For serious artists',
      color: 'yellow',
      features: [
        'Up to 200 AI generations (lifetime)',
        'Upload unlimited artworks',
        'Create unlimited posts',
        'Priority support',
        'Advanced analytics',
        'Custom themes',
        'Early access to new features',
        'Professional portfolio tools'
      ],
      limitations: []
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: faGem,
      price: '$39.99',
      period: 'month',
      description: 'For professionals',
      color: 'purple',
      features: [
        'Up to 1000 AI generations (lifetime)',
        'Upload unlimited artworks',
        'Create unlimited posts',
        '24/7 priority support',
        'Advanced analytics',
        'Custom themes',
        'Early access to new features',
        'Professional portfolio tools',
        'API access',
        'White-label options',
        'Custom integrations'
      ],
      limitations: []
    }
  ];

  const handleContactAdmin = () => {
    const subject = encodeURIComponent('Subscription Inquiry');
    const body = encodeURIComponent(`Hi Admin,

I'm interested in upgrading my subscription plan. Please let me know how to proceed with payment.

Current plan: Free
Desired plan: ${selectedPlan ? plans.find(p => p.id === selectedPlan)?.name : 'Please specify'}

Thank you!`);
    
    window.open(`mailto:admin@muralfinder.net?subject=${subject}&body=${body}`, '_blank');
  };

  const getColorClasses = (color) => {
    const colors = {
      gray: theme === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-200 bg-gray-50 text-gray-700',
      blue: theme === 'dark' ? 'border-blue-600 bg-blue-900 text-blue-200' : 'border-blue-200 bg-blue-50 text-blue-700',
      yellow: theme === 'dark' ? 'border-yellow-600 bg-yellow-900 text-yellow-200' : 'border-yellow-200 bg-yellow-50 text-yellow-700',
      purple: theme === 'dark' ? 'border-purple-600 bg-purple-900 text-purple-200' : 'border-purple-200 bg-purple-50 text-purple-700'
    };
    return colors[color] || colors.gray;
  };

  return (
    <ModernLayout>
      <div className="min-h-screen py-12 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <FontAwesomeIcon 
                icon={faRobot} 
                className="text-4xl mr-3 text-white" 
              />
              <h1 className="text-4xl font-bold font-raleway text-white">
                AI Generation Plans
              </h1>
            </div>
            <p className="text-xl font-raleway mb-8 text-white">
              Unlock more AI generations and premium features
            </p>
            
            {/* Coming Soon Banner */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full font-raleway font-semibold mb-8">
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              Coming Soon - Contact Admin for Early Access
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  selectedPlan === plan.id 
                    ? 'border-indigo-300 bg-indigo-100 shadow-xl scale-105' 
                    : getColorClasses(plan.color)
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Popular Badge */}
                {plan.id === 'premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold font-raleway">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.id === 'free' ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') :
                    plan.id === 'basic' ? (theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100') :
                    plan.id === 'premium' ? (theme === 'dark' ? 'bg-yellow-800' : 'bg-yellow-100') :
                    (theme === 'dark' ? 'bg-purple-800' : 'bg-purple-100')
                  }`}>
                    <FontAwesomeIcon 
                      icon={plan.icon} 
                      className={`text-2xl ${
                        plan.id === 'free' ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-600') :
                        plan.id === 'basic' ? (theme === 'dark' ? 'text-blue-300' : 'text-blue-600') :
                        plan.id === 'premium' ? (theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600') :
                        (theme === 'dark' ? 'text-purple-300' : 'text-purple-600')
                      }`} 
                    />
                  </div>
                  <h3 className={`text-2xl font-bold font-raleway mb-2 ${
                    selectedPlan === plan.id ? 'text-indigo-900' : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                  }`}>{plan.name}</h3>
                  <p className={`font-raleway mb-4 ${
                    selectedPlan === plan.id ? 'text-indigo-700' : (theme === 'dark' ? 'text-gray-300' : 'text-gray-600')
                  }`}>{plan.description}</p>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold font-raleway ${
                      selectedPlan === plan.id ? 'text-indigo-900' : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                    }`}>{plan.price}</span>
                    <span className={`font-raleway ${
                      selectedPlan === plan.id ? 'text-indigo-700' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')
                    }`}>/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <FontAwesomeIcon 
                        icon={faCheck} 
                        className="text-green-500 mr-3 mt-1 flex-shrink-0" 
                      />
                      <span className={`text-sm font-raleway ${
                        selectedPlan === plan.id ? 'text-indigo-800' : (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')
                      }`}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start">
                        <span className={`mr-3 mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>•</span>
                        <span className={`text-sm font-raleway ${
                          selectedPlan === plan.id ? 'text-indigo-600' : (theme === 'dark' ? 'text-gray-500' : 'text-gray-500')
                        }`}>{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Select Button */}
                <ModernButton
                  variant={selectedPlan === plan.id ? 'primary' : 'secondary'}
                  size="lg"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </ModernButton>
              </div>
            ))}
          </div>

          {/* Contact Admin Section */}
          <div className={`rounded-2xl shadow-xl p-8 text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="max-w-2xl mx-auto">
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className={`text-4xl mb-4 ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`} 
              />
              <h2 className={`text-3xl font-bold font-raleway mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Ready to Upgrade?
              </h2>
              <p className={`text-lg font-raleway mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Subscription payments are coming soon! For now, contact our admin team to upgrade your plan manually.
                We&apos;ll help you get set up with the features you need.
              </p>
              
              {selectedPlan && (
                <div className={`rounded-lg p-4 mb-6 ${
                  theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-50'
                }`}>
                  <p className={`font-raleway font-semibold ${
                    theme === 'dark' ? 'text-indigo-200' : 'text-indigo-800'
                  }`}>
                    Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}
                  </p>
                  <p className={`font-raleway ${
                    theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
                  }`}>
                    {plans.find(p => p.id === selectedPlan)?.price}/{plans.find(p => p.id === selectedPlan)?.period}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ModernButton
                  variant="primary"
                  size="lg"
                  icon={<FontAwesomeIcon icon={faEnvelope} />}
                  onClick={handleContactAdmin}
                >
                  Contact Admin
                </ModernButton>
                <ModernButton
                  variant="secondary"
                  size="lg"
                  icon={<FontAwesomeIcon icon={faUsers} />}
                  onClick={() => window.open('mailto:support@muralfinder.net', '_blank')}
                >
                  General Support
                </ModernButton>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold font-raleway text-center mb-12 text-white">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`rounded-lg p-6 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold font-raleway mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  What are AI generations?
                </h3>
                <p className={`font-raleway ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  AI generations allow you to create custom mural designs using our AI tools. Each generation creates a unique artwork that you can use as inspiration or upload to your portfolio.
                </p>
              </div>
              <div className={`rounded-lg p-6 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold font-raleway mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Are generations lifetime limits?
                </h3>
                <p className={`font-raleway ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Yes! All AI generations are tracked as lifetime limits. Even if you delete generated artworks, your generation count doesn&apos;t reset. This ensures you get full value from your subscription.
                </p>
              </div>
              <div className={`rounded-lg p-6 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold font-raleway mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Can I change plans later?
                </h3>
                <p className={`font-raleway ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Absolutely! You can upgrade or downgrade your plan at any time. Your generation limits will be updated accordingly, and you&apos;ll keep all your previous generations.
                </p>
              </div>
              <div className={`rounded-lg p-6 shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold font-raleway mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  When will payment be available?
                </h3>
                <p className={`font-raleway ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  We&apos;re working on integrating secure payment processing. For now, contact our admin team for manual upgrades. We&apos;ll notify all users when automated payments are ready!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default SubscriptionPlans;