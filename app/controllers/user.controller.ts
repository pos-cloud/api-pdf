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
    const pdf = new jsPDF();
       const currentDir = __dirname;

      const imagePai = path.join(currentDir, '../assets/paisaje.jpg');
      const imageCode = path.join(currentDir, '../assets/code.png')

      const image = fs.readFileSync(imagePai);
      const imagec = fs.readFileSync(imageCode)
      
      const imageBase = image.toString('base64');
      const imageBase2 = imagec.toString('base64');
      
        pdf.text('Hola, este es un PDF generado desde Node.js con jsPDF.', 10, 10);
        pdf.line(15, 15, 200, 15);
        pdf.addImage(imageBase,"JPEG",10, 70, 100, 75)
        pdf.addImage(imageBase2,"JPEG",10, 10, 50, 65)
        pdf.autoPrint()
         const pdfBase64 = pdf.output('datauristring');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=generated.pdf');

      res.send(pdfBase64);

    } catch (error) {
       console.log(error)
    }
  }
}