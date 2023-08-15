import { Request, Response, NextFunction } from 'express';
import MongoDBManager from '../dbs/mongodb';
import { ObjectId } from 'mongodb';
import { UserI } from '../interfaces';
const path = require('path')
const fs = require('fs');
const { jsPDF } = require('jspdf');

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
  async getPDF(req: any , res: any, next: NextFunction){
    try {
       
      const doc = new jsPDF();

      const currentDir = __dirname;

      const imagePai = path.join(currentDir, '../assets/paisaje.jpg');
      const imageCode = path.join(currentDir, '../assets/code.png')

      const image = fs.readFileSync(imagePai);
      const imagec = fs.readFileSync(imageCode)
      
      const imageBase = image.toString('base64');
      const imageBase2 = imagec.toString('base64');
      doc.text("Hello world!", 10, 10);
      doc.line(15, 15, 200, 15);
      doc.addImage(imageBase,"JPEG",10, 70, 100, 75)
      doc.addImage(imageBase2,"JPEG",10, 10, 50, 65)
      // doc.save("a4.pdf");
    
     // const pdfData = doc.output('arraybuffer');
      doc.autoPrint({variant:'non-conform'})                                                                              

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="a4.pdf"');
      doc.save('autopint.pdf')
               
    } catch (error) {
       console.log(error)
    }
  }
}