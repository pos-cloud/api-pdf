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