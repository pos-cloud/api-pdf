import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { getPrintArticle } from '../controllers/getPrintArticle.controller';
class PrintRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/article', [authMiddleware], getPrintArticle);
    this.router.get('/articles', [authMiddleware]);
    this.router.get('/transaction', [authMiddleware]);
  }
}
export default new PrintRoutes().router;