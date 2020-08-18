import axios from 'axios'

export default {
  auth: {
    me: () => axios.post('auth/me'),
    login: (data) => axios.post('auth/login', data),
    passwordReset: (data) => axios.post('password/create', data)
  }
}
