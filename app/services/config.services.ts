import MongoDBManager from "../db/connection";
import Config from "../models/config";

const mongoDBManager = new MongoDBManager();

export async function getConfig(database: string) : Promise<Config>{
    try {
        await mongoDBManager.initConnection(database);
        const configCollection = mongoDBManager.getCollection('configs');
        const aggregationPipeline = [
            {
              $lookup: {
                from: 'vat-conditions',
                localField: 'companyVatCondition',
                foreignField: '_id',
                as: 'companyVatCondition',
              },
            }, 
            {
                $unwind: '$companyVatCondition',
              },
          ];
      
        const configArray = await configCollection.aggregate(aggregationPipeline).toArray();
        
        const configResult: Config= configArray[0] as Config;
        return configResult;
    } catch (error) {
        console.log(error)
    }
}
