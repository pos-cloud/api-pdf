import axios from "axios";

export async function getArticleData(articleId: string, token: string) {
    try {
        const URL = `${process.env.APIV1}article`;
        const headers = {
            'Authorization': token,
        };
        const params = {
            id: articleId,
        };

        const response = await axios.get(URL, { headers, params})
    
        return response.data.article
    } catch (error) {
        throw Error(error);
    }

}
