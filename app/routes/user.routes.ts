import { Router, response } from 'express';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

class UserRoutes {
  router = Router();
  UserController = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/me', [authMiddleware], this.UserController.getMe);
    this.router.get('/pdf', this.UserController.getPDF)
  }
}
export default new UserRoutes().router;