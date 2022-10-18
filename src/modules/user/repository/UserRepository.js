import User from "../model/User.js";
import bcrypt from 'bcrypt';

class UserRepository {

  async store(req) {
    try {
      let { name, email, cpf, birthdate, password } = req.body;
      password = await bcrypt.hash(password, 10);
      console.log(password);
      return await User.create({ name, email, cpf, birthdate, password });
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  async findById(id) {
    try {
      return await User.findOne({ where: { id } });
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ where: { email } });
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }
}

export default new UserRepository();