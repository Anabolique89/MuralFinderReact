import axios from 'axios';
import { BASE_URL } from '../constants/ApiEndpoints';

const contactService = {
  sendMessage: async (formData) => {
    try {
        console.log(formData)
      const response = await axios.post(`${BASE_URL}contact`, formData);
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};

export default contactService;
