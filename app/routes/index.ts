import userRoutes from './print.routes';

export default class Routes {
  constructor(app: any) {
    app.use('/', userRoutes);
  }
}