import UserService from "../service/UserService.js";


class UserController {
  async store(req, res) {
    let user = await UserService.store(req);
    return res.status(req.status).json(user);
  }

  async getAccessToken(req, res) {
    let accessToken = await UserService.getAccessToken(req);
    return res.status(req.status).json(accessToken);
  }

  async findByEmail(req, res) {
    let user = await UserService.findByEmail(req);
    return res.status(req.status).json(user);
  }
}

export default new UserController();