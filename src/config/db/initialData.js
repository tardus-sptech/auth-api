import bcrypt from "bcrypt";
import User from '../../modules/user/model/User.js';

export async function createInitialData() {
  try {
    await User.sync({ force: true });

    let password = await bcrypt.hash("123456", 10);

    await User.create({
      name: 'Renan Oliveira',
      cpf: '42048248298', 
      birthDate: null,
      email: 'renan.oliveira@taurus.com',
      password: password,
    });

    await User.create({
      name: 'Pedro Henrique',
      cpf: '22048248291', 
      birthDate: null,
      email: 'pedro.henrique@taurus.com',
      password: password,
    });

  } catch(err) {
    console.log(err)
  }
}