import React, { useState } from 'react';
import { fadeintoyouWhite } from '../assets';
import contactService from '../services/ContactService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPen } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });

  const [message, setMessage] = useState({
    type: '',
    content: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await contactService.sendMessage(formData);
      console.log(response);
      showMessage('success', 'Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        content: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      showMessage('error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => {
      setMessage({ type: '', content: '' });
    }, 5000);
  };

  return (
    <div className="relative bg-indigo-700 min-h-screen flex items-center justify-center">
      <img className="hidden md:block absolute top-0 right-0 h-full w-auto z-0" src={fadeintoyouWhite} alt="Background" />
      <form className="bg-indigo-500 shadow-md rounded-3xl p-8 w-full max-w-2xl z-10" onSubmit={handleSubmit}>
        <h1 className="text-3xl text-white font-semibold mb-8">Send us a message</h1>
        {message.type === 'success' && <div className="absolute top-10 right-10 bg-green-500 text-white px-4 py-2 rounded w-50">{message.content}</div>}
        {message.type === 'error' && <div className="absolute top-10 right-10  bg-red-500 text-white px-4 py-2 rounded w-50">{message.content}</div>}
        <div className="mb-4 relative">
          <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            className="w-full pl-10 border border-gray-300 p-2 rounded-md focus:outline-none focus:border-indigo-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 relative">
          <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="w-full pl-10 border border-gray-300 p-2 rounded-md focus:outline-none focus:border-indigo-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 relative">
          <FontAwesomeIcon icon={faPen} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            className="w-full pl-10 border border-gray-300 p-2 rounded-md focus:outline-none focus:border-indigo-500"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <textarea
            id="content"
            name="content"
            placeholder="Message"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-indigo-500 resize-none"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-center">
          <button type="submit" disabled={isLoading} className="py-2 px-4 bg-indigo-900 w-full text-white font-semibold rounded-md transition duration-300 hover:bg-indigo-600 focus:outline-none">
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

    </div>
  );
}

export default Contact;
