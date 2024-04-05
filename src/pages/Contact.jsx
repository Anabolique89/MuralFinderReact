import React, { useState } from 'react';
import { fadeintoyouWhite } from '../assets';
import styles, { layout } from '../style';
import contactService from '../services/ContactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await contactService.sendMessage(formData);
      console.log(response);
      setSuccessMessage('Message sent successfully!');
      setErrorMessage('');
      // Clear form fields on successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        content: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Failed to send message. Please try again.');
      setSuccessMessage('');
    }
  };

  return (

    <div className={`${layout.sectionImg} bg-indigo-700 mt-0`} >

      <form className="login-form absolute z-[5] backdrop-filter backdrop-blur-lg p-4 md:p-8 sm:p-10 ss:p-34 rounded-2xl border-solid border-2 border-indigo-600" onSubmit={handleSubmit}>
        <h1 className='font-raleway font-semibold ss:text-[30px] text-[35px] text-white ss:leading-[40px] leading-[45px] w-full  p-2'>Send us a message.</h1>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="form-group">
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              className="input-text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="input-text"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-wrapper">
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              className="input-text"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-wrapper">
            <textarea
              id="content"
              name="content"
              placeholder="Message"
              className="input-text mt-8"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={`${styles.flexCenter} p-4`}>
          <button type="submit" className={` py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full mt-8 ${styles}`}>Login</button>
        </div>
      </form>
      <div className={layout.sectionImg}>
        <img className='w-[80%] h-auto relative z-[2] w-[100%] p-2 md:px-20 sm:px-26 ss:px-34' src={fadeintoyouWhite} alt="bkgImg" /></div>
    </div>
  )
}

export default Contact