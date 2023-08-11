import axios from 'axios'
import { useUserStore } from '../stores/user'

const token = window.localStorage['token'] || ''
const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  }
}
export default (baseURL) => {
  return axios.create({
    baseURL: `http://localhost:5000/${baseURL}`,
    ...commonConfig
  })
}
