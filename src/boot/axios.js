import axios from 'axios'

const axiosInstance = axios.create()

export default ({ app, router, store, Vue }) => {
  // Set axios instance on app
  Vue.prototype.$axios = axiosInstance
}

export const getAxiosInstance = () => axiosInstance
