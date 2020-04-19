import { getAxiosInstance } from 'boot/axios'
import { getInstance } from 'boot/auth0'

export async function updateUserData (context) {
  const axios = getAxiosInstance()
  const auth = getInstance()
  if (!auth.loading && auth.user && auth.user.sub) {
    const sub = auth.user.sub
    const res = await axios.get(`/api/user/${sub}`, auth.getAxiosHeader())
    // commit via mutation
    context.commit('setUser', res.data.data)
  }
}
