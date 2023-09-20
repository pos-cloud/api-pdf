import axios from "axios";
import MovementOfArticle from "models/movements-of-articles";

export async function getMovementOfArticle(id: string, token: string): Promise<MovementOfArticle[]>{
  try {
     
    let query = 'where="transaction":"' + id + '"';
    const URL = `${process.env.APIV1}movements-of-articles`;
    const headers = {
        'Authorization': token,
    };

    const params = {
      query: query
    }
  
    const data = await axios.get(URL, { headers, params })
    const response: MovementOfArticle[] = data.data.movementsOfArticles
    console.log('aca',response)
    return response
   } catch (error) {
    console.log(error)
   }
}