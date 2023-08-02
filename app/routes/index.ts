import userRoutes from './user.routes';

export default class Routes {
  constructor(app: any) {
    app.use('/', userRoutes);
  }
}