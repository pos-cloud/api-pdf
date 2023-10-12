import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { getPrintArticle } from '../controllers/get-print-article.controller';
import { getPrintTransaction } from '../controllers/get-print-transaction';
import { getImage } from '../controllers/get-image.controller';

class PrintRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/article', [authMiddleware], getPrintArticle);
    this.router.get('/transaction', [authMiddleware], getPrintTransaction);
    this.router.get('/get-img', [authMiddleware], getImage);
  }
}
export default new PrintRoutes().router;