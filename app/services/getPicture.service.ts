import axios from "axios";

export async function getCompanyPictureData(picture: string, token: string) {
    try {
        const URL = `${process.env.APIV1}get-image-base64-company`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token,
        };
        const params = {
            picture: picture,
        };

        const response = await axios.get(URL, { headers, params })
      
     return response.data 
    } catch (error) {
        // console.log(error)
        throw Error(error);
    }

}