import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jwt-simple';

interface DataJWT {
  user: string;
  database: string;
  clientId: string;
  iat: number;
  exp: number;
}

async function authMiddleware(
  request: any,
  response: any,
  next: any,
) {
  if (request?.headers?.authorization) {
    const token = request.headers.authorization.replace(/['"]+/g, '');
    try {
      const dataJWT: DataJWT = jwt.decode(
        token,
        process.env.TOKEN_SECRET || '',
      );

      const database: string = dataJWT?.database;
      const userId: string = dataJWT?.user;

      request['database'] = database;
      request['userId'] = userId;

      next();
    } catch (error) {
      response.status(500).send({ message: error.toString() });
    }
  } else {
    response.status(500).send({ message: 'No se encontro authorization' });
  }
}

export default authMiddleware;
