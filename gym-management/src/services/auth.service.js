import Request from './api.service'
class AuthService {
  constructor(baseUrl = '') {
    this.api = Request(baseUrl)
  }
  async register(body) {
    return await this.api.post('khach/', body)
  }
  async login(body) {
    return (await this.api.post('auth/login', body)).data
  }
  async getIdentity() {
    return (await this.api.get('auth')).data
  }
}
export default new AuthService()
