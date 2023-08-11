import Request from './api.service'
class GoiTapService {
  constructor(baseUrl = 'goitap') {
    this.api = Request(baseUrl)
  }
  async getAll() {
    return await this.api.get('/')
  }
}
export default GoiTapService
