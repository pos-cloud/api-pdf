"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class MongoDBManager {
    constructor() {
        this.client = null;
        this.database = null;
        this.collection = null;
    }
    //uri = "mongodb+srv://pos:pos@cluster0.fscmrqu.mongodb.net/?retryWrites=true&w=majority";
    async initConnection(databaseName) {
        try {
            const mongoUri = `mongodb://localhost:27017/${databaseName}`;
            if (!this.client) {
                this.client = await mongodb_1.MongoClient.connect(mongoUri);
                this.database = this.client.db(databaseName);
            }
            console.log('Conexión con MongoDB establecida');
        }
        catch (error) {
            console.error('Error al conectar con MongoDB:', error);
            throw error;
        }
    }
    getCollection(collectionName) {
        if (!this.database) {
            throw new Error('La conexión con la base de datos no ha sido establecida');
        }
        this.collection = this.database.collection(collectionName);
        return this.collection;
    }
    async closeConnection() {
        try {
            if (this.client) {
                await this.client.close();
                console.log('Conexión con MongoDB cerrada');
            }
        }
        catch (error) {
            console.error('Error closing MongoDB connection:', error);
            throw error;
        }
    }
}
exports.default = MongoDBManager;
//# sourceMappingURL=connection.js.map