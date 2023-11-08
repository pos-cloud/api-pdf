"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = void 0;
const get_picture_services_1 = require("../services/get-picture.services");
async function getImage(req, res) {
    const url = req.query.picture;
    const imageBase64 = await (0, get_picture_services_1.getCompanyPictureFromGoogle)(url);
    return res.status(200).send({ imageBase64 });
}
exports.getImage = getImage;
//# sourceMappingURL=get-image.controller.js.map