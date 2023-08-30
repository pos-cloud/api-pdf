import { Router, response } from 'express';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
import { getArticleController } from '../controllers/LabelArticleController';

class UserRoutes {
  router = Router();
  UserController = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/me', [authMiddleware], this.UserController.getMe);
    this.router.get('/pdf', this.UserController.getPDF)
    this.router.get('/article', [authMiddleware], getArticleController)
  }
}
export default new UserRoutes().router;