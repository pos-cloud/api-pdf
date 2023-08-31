import { Router, response } from 'express';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
import { getArticleLabelController } from '../controllers/labelArticle.controller';

class UserRoutes {
  router = Router();
  UserController = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/me', [authMiddleware], this.UserController.getMe);
    this.router.get('/pdf', this.UserController.getPDF)
    this.router.get('/article', [authMiddleware], getArticleLabelController)
  }
}
export default new UserRoutes().router;