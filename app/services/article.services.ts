import axios from "axios";
import Article from "models/article";

export async function getArticleData(articleId: string, token: string): Promise <Article[]>{
    try {
        const URL = `${process.env.APIV1}article`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            id: articleId,
        };

        const data = await axios.get(URL, { headers, params})
        const response: Article[] = data.data.article
    
        return response
    } catch (error) {
        throw Error(error);
    }
}