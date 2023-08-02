import { Request, Response, NextFunction } from 'express';
import MongoDBManager from '../dbs/mongodb';
import { ObjectId } from 'mongodb';
import { UserI } from '../interfaces';
const { jsPDF } = require('jspdf')

const mongoDBManager = new MongoDBManager();

export default class UserController {
  async getMe(request: any , response: any, next: NextFunction) {
    try {
      await mongoDBManager.initConnection(request['database'] || '');
      const usersCollection = mongoDBManager.getCollection('users');
      const user: UserI = await usersCollection.findOne({
        _id: new ObjectId(request['userId']),
      });

      if (!user) {
        return response.status(404).json({ message: 'Usuario no encontrado' });
      }
      return response.status(200).json(user);
    } catch (error) {
      mongoDBManager.closeConnection();
      return response.status(500).json({ message: error.toString() });
    }
  }
  async getPDF(request: any , response: any, next: NextFunction){
    try {
       
      const doc = new jsPDF();
      doc.text("Hello world!", 10, 10);
      doc.addImage("data:image/png;base64,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",'JPEG', 15, 40, 180, 160)
      doc.sve("a4.pdf");
    } catch (error) {
       console.log(error)
    }
  }

}

