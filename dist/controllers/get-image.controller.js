"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = void 0;
const getPicture_service_1 = require("../services/getPicture.service");
async function getImage(req, res) {
    const url = req.query.picture;
    const imageBase64 = await (0, getPicture_service_1.getCompanyPictureFromGoogle)(url);
    return res.status(200).send({ imageBase64 });
}
exports.getImage = getImage;
//# sourceMappingURL=get-image.controller.js.map