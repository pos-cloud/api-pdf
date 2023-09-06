import axios from "axios";

export function getCompanyPictureData(picture: string, token: string) {
    try {
      const URL = `${process.env.PORT_APIV1}get-image-base64-company`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization':  token,
      };
      const params = {
        picture: picture,
      };
  
      const response = axios.get(URL, { headers, params })
      return response
    } catch (error) {
      console.log(error)
    }
  
}

// function getImageBase64(image: string) {


// 	let fs = require('fs');
// 	let picture = image;

// 	if (picture && picture !== undefined) {
// 		try {
// 			let bitmap = fs.readFileSync(path.resolve('/home/clients/' + req.session.database + '/images/company/' + picture));
// 			return res.status(200).send({ imageBase64: new Buffer(bitmap).toString('base64') });
// 		} catch (err) {
// 			fileController.writeLog(req, res, next, 404, constants.NO_IMAGEN_FOUND);
// 			return res.status(404).send(constants.NO_IMAGEN_FOUND);
// 		}
// 	}
// }
