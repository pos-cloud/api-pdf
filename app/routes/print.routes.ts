import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { getPrintArticle } from '../controllers/getPrintArticle.controller';
import { getPrintTransaction } from '../controllers/getPrintTransaction';

class PrintRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/article', [authMiddleware], getPrintArticle);
    this.router.get('/transaction', [authMiddleware], getPrintTransaction);
  }
}
export default new PrintRoutes().router;