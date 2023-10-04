"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyPictureFromGoogle = exports.getCompanyPictureData = void 0;
const axios_1 = require("axios");
async function getCompanyPictureData(picture, token) {
    try {
        const URL = `${process.env.APIV1}get-image-base64-company`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token,
        };
        const params = {
            picture: picture,
        };
        const response = await axios_1.default.get(URL, { headers, params });
        return response.data.imageBase64;
    }
    catch (error) {
        console.log(error);
    }
}
exports.getCompanyPictureData = getCompanyPictureData;
function getCompanyPictureFromGoogle(picture) {
    return new Promise((resolve, reject) => {
        axios_1.default.get(picture, { responseType: 'arraybuffer' })
            .then(response => {
            const base64Image = Buffer.from(response.data, 'binary').toString('base64');
            resolve('data:image/jpeg;base64,' + base64Image);
        })
            .catch(error => {
            console.error('Error al obtener la imagen:', error);
            reject(error);
        });
    });
}
exports.getCompanyPictureFromGoogle = getCompanyPictureFromGoogle;
//# sourceMappingURL=getPicture.service.js.map