import * as httpStatus from "../../../config/constants/httpStatus.js"
import UserException from "../exception/UserException.js";
import UserRepository from "../repository/UserRepository.js";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as secrets from "../../../config/constants/secrets.js"

class UserService {

  async store(req) {
    try {
      let user = await UserRepository.store(req)  
      req.status = httpStatus.SUCCESS;
      this.validateUserAlreadyExists(user);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }
    } catch(err) {
      const status = err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR;
      req.status = status;
      return {
        message: err.message,
      };
    }
  }

  validateUserAlreadyExists(user) {
    if (!user) {
      throw new UserException(
        httpStatus.BAD_REQUEST, 
        "User already exists."
      );
    }
  }

  async findByEmail(req) {
    try {
      const { email } = req.params;
      const { authUser } = req;
      this.validateRequestData(email);
      let user = await UserRepository.findByEmail(email);
      this.validateUserNotFound(req, user);
      this.validateAuthenticatedUser(user, authUser);
      req.status = httpStatus.SUCCESS;
      return {
          id: user.id,
          name: user.name,
          email: user.email,
      }
    } catch (err) {
      const status = err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR;
      req.status = status;
      return {
        message: err.message,
      };
    }
  }

  validateRequestData(email) {
    if (!email) {
      throw new UserException(
        httpStatus.BAD_REQUEST, 
        "User email was not informed."
      );
    }
  }

  validateUserNotFound(req, user) {
    if (!user) {
      req.status = httpStatus.BAD_REQUEST;
      throw new UserException(
        httpStatus.BAD_REQUEST, 
        "User was not found."
      );
    }
  }

  validateAuthenticatedUser(user, authUser) {
    if (!authUser || user.id !== authUser.id) {
      throw new UserException(
        httpStatus.FORBIDDEN,
        'You cannot see this user data.'
      );
    }
  }

  async getAccessToken(req) {
    try {
      const { email, password } = req.body;
      this.validateAccessTokenData(email, password);
      let user = await UserRepository.findByEmail(email);
      this.validateUserNotFound(req, user);
      await this.validatePassword(password, user.password);
      const authUser = { id: user.id, name: user.name, email: user.email };
      const accessToken = jwt.sign({ authUser }, secrets.API_SECRET, {expiresIn: '1d'})
      req.status = httpStatus.SUCCESS;
      return {
        accessToken
      };
    } catch (err) {
      const status = err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR;
      req.status = status;
      return {
        message: err.message,
      };
    }
  }

  validateAccessTokenData(email, password) {
    if (!email || !password) {
      throw new UserException(
        httpStatus.UNAUTHORIZED,
        "Email and password must be informed."
      )
    }
  }

  async validatePassword(password, hashPassword) {
    if (!await bcrypt.compare(password, hashPassword)) {
      throw new UserException(httpStatus.UNAUTHORIZED, "Password doesn't match.")
    }
  }
}

export default new UserService();