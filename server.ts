const dotenv =  require('dotenv')
dotenv.config();
import * as express from 'express';
import App from "./app/app"

//const app = express(); 
const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

new App(app);

app.listen(3001, 'localhost', function () {
    console.info(`Server running on : http://localhost:3001`);
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('server startup error: address already in use');
    } else {
      console.log(err);
    }
  });