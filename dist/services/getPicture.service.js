"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyPictureData = void 0;
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
//# sourceMappingURL=getPicture.service.js.map