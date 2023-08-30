
import * as express from 'express';
import App from "./app/app"

const dotenv =  require('dotenv')
dotenv.config();

const app = express();
new App(app);

app.listen(process.env.PORT, () => {
    console.info(`Server running on : ${process.env.PORT}`);
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('server startup error: address already in use');
    } else {
      console.log(err);
    }
  });