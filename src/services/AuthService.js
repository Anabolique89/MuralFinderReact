import { BASE_URL, authEndpoints } from "../constants/ApiEndpoints";

const AuthService = {
  login: async (email, password) => {
    try {
      const inputObj = { email, password };

      const response = await fetch(`${BASE_URL}${authEndpoints.login}`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(inputObj)
      });

      const data = await response.json();

      if (response.ok) {
        const dataObj = data.data;
        return { user: dataObj.user, token: dataObj.token };
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      throw err;
    }
  },

  signup: async (username, email, role, password, passwordConfirmation) => {
    try {
      const inputObj = {
        username,
        email,
        role,
        password,
        password_confirmation: passwordConfirmation
      };

      const response = await fetch(`${BASE_URL}${authEndpoints.register}`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(inputObj)
      });

      const data = await response.json();

      if (response.ok) {
        return { message: data.message };
      } else {
        if (data && typeof data === 'object' && data.message && typeof data.message === 'object') {
          let errorString = '';

          for (const key in data.message) {
            if (Array.isArray(data.message[key])) {
              errorString += data.message[key].join(' ') + ' ';
            }
          }

          throw new Error(errorString.trim());
        } else {
          console.log(data);
          throw new Error('An error occurred during signup.');
        }
      }
    } catch (err) {
      throw err;
    }
  }
};

export default AuthService;