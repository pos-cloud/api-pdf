import axios from "axios";
import MovementOfCash from "models/movement-of-cash";

export async function getMovementsOfCash(
  token: string,
  project: {},
  match: {},
  ): Promise<MovementOfCash[]>{
  try {

    const URL = `${process.env.APIV1}v2/movements-of-cashes`;
    const headers = {
        'Authorization': token,
    };

    const params = {
      project: project,
      match: match,
    }
    const data = await axios.get(URL, { headers: headers, params: params })
    const response: MovementOfCash[] = data.data.movementsOfCashes
    console.log(response)
    return response
   } catch (error) {
    console.log(error)
   }
}