import { useState } from 'react';
import { fadeintoyouWhite } from '../../assets';
import contactService from '../../services/ContactService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faTag, faMessage } from '@fortawesome/free-solid-svg-icons';
import { ModernRoute, ModernInput, ModernButton } from '../../components';
import { useToast } from '../../contexts/ToastContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.content.trim()) {
      errors.content = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await contactService.sendMessage(formData);
      toast.success('Your message has been sent successfully! We\'ll get back to you soon.', 'Message Sent');
      setFormData({
        name: '',
        email: '',
        subject: '',
        content: ''
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.', 'Send Failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Icon components
  const UserIcon = () => (
    <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
  );

  const EmailIcon = () => (
    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
  );

  const SubjectIcon = () => (
    <FontAwesomeIcon icon={faTag} className="h-5 w-5" />
  );

  const MessageIcon = () => (
    <FontAwesomeIcon icon={faMessage} className="h-5 w-5" />
  );

  return (
    <ModernRoute title="Contact Us" showHeader={false}>
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-5xl flex rounded-lg overflow-hidden shadow-xl my-8">
          {/* Left Side - Blue Background with Image */}
          <div className="hidden lg:block relative w-0 flex-1 bg-indigo-600 min-h-[600px] p-8">
            <div className="h-full flex items-center justify-center">
              <img
                className="w-4/5 max-h-[80%] object-contain transition-transform duration-700 hover:scale-110"
                src={fadeintoyouWhite}
                alt="Contact us"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-4 h-4 bg-secondary/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-2 h-2 bg-secondary/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-secondary/30 rounded-full animate-bounce"></div>

            <div className="absolute bottom-8 left-8 text-white animate-slide-in-left">
              <h3 className="text-2xl font-raleway font-bold mb-2 text-white">
                Get In Touch
              </h3>
              <p className="text-lg font-raleway text-dimWhite opacity-90 mb-4">
                We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-0.5 bg-blue-gradient rounded-full"></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <div className="w-8 h-0.5 bg-blue-gradient rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white min-h-[600px]">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              {/* Header */}
              <div className="text-center mb-8 animate-slide-in-up">
                <h2 className="text-3xl font-raleway font-bold mb-2 text-gray-900">
                  Contact Us
                </h2>
                <p className="text-gray-600 font-raleway">
                  Send us a message and we&apos;ll get back to you
                </p>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                <ModernInput
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                  icon={<UserIcon />}
                  placeholder="Enter your full name"
                  fullWidth
                  autoComplete="name"
                />

                <ModernInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  icon={<EmailIcon />}
                  placeholder="Enter your email"
                  fullWidth
                  autoComplete="email"
                />

                <ModernInput
                  label="Subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  error={formErrors.subject}
                  icon={<SubjectIcon />}
                  placeholder="Enter message subject"
                  fullWidth
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 font-raleway">
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3 pointer-events-none">
                      <MessageIcon />
                    </div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter your message"
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway resize-none ${
                        formErrors.content ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {formErrors.content && (
                    <p className="text-sm text-red-600 font-raleway">{formErrors.content}</p>
                  )}
                </div>

                <ModernButton
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  className="animate-slide-in-up"
                  style={{animationDelay: '0.4s'}}
                >
                  {isLoading ? 'Sending Message...' : 'Send Message'}
                </ModernButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ModernRoute>
  );
}

export default Contact;
