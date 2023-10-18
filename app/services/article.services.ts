import axios from "axios";
import Article from "models/article";

export async function getArticleData(articleIds: string, token: string): Promise <Article[]>{
    try {
        const URL = `${process.env.APIV1}article`;
        const headers = {
            'Authorization': token,
        };

        let articleIdsArray = Array.isArray(articleIds) ? articleIds : [articleIds];
        const responses: Article[] = [];

        for (const id of articleIdsArray) {
            const params = { 'id': id };
            const data = await axios.get(URL, { headers, params });
            responses.push(data.data.article);
        }

        return responses;
    } catch (error) {
        console.log(error)
    }
}