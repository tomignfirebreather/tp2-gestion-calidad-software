const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MongoUrlAtlas = process.env.MONGO_URL_ATLAS;

const connection = async function () {
    try {
        await mongoose.connect(MongoUrlAtlas);
    }
    catch (error) {
        return { success: 'error', error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
    }
    finally {
    }
}

module.exports = connection;