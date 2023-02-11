import { API_URL } from "../Api";


export const LoginApi = async (data) => {
  try {
    const response = await fetch(API_URL + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        data
      )
    });

    return { statusCode: response.status, data: await response.json() };

  } catch (error) {
    return error
  }

}
export const SignUpApi = async (data) => {
  try {
    const response = await fetch(API_URL + '/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        data
      )
    });
    return { statusCode: response.status, data: await response.json() };

  } catch (error) {
    return error;
  }

}