import { json, urlencoded } from 'express';
const morgan = require('morgan')
import Routes from './routes';
const cors = require('cors')

const corsOptions = {
  origin: 'http://localhost:4200', // Cambia a tu URL de Angular
  optionsSuccessStatus: 200,
};

export default class App {
  constructor(app: any) {
    this.config(app);
    new Routes(app);
  }

  public config(app:any): void {
    app.use(json());
    // const accessLogStream: WriteStream = fs.createWriteStream(
    //   path.join(__dirname, './logs/access.log'),
    //   { flags: 'a' }
    // );
     app.use(morgan('dev'));
     app.use(urlencoded({ extended: true }));
     app.use(cors(corsOptions));
    //app.use(json());
    //app.use(helmet());
    //app.use(rateLimiter()); //  apply to all requests
    ///app.use(unCoughtErrorHandler);
  }
}