import axios from "axios";

function getBarcode(barcode: any, token: string) {
  try {
    const URL = `${process.env.PORT_APIV1}barcode/${barcode}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    };

    const response = axios.get(URL, { headers })

    return response
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getBarcode };