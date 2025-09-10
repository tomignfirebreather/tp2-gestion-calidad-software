const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const mongoUrlAtlas = process.env.MONGO_URL_ATLAS;

const productSchema = new Schema({
    productName: { type: String, index: true, required: true } ,
    productDescription: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productStock: { type: Number, required: true },
    productImage: { type: String, required: true },
    lastDateModified: { type: Date, default: Date.now }
});

const buscarData = async function (data) {
    try {
        await mongoose.connect(mongoUrlAtlas);
        const Product = mongoose.model('Product', productSchema);

        if(data === 'buscarTodo'){
            const result = await Product.find({});
            if(result.length !== 0){
                return { success: 'sidata', producto: result};
            }
        }
        else{
            for (let key in data) {
                let value = data[key];
                let query = {};
                if (key === 'productID') {
                    query['_id'] = new ObjectId(value);
                } else {
                    query[key] = value;
                }
                result = await Product.findOne(query);
                if(result !== null){
                    return { success: 'sidata', producto: result};
                }
            }
        }
        return { success: 'nodata', error: 'No se han encontrado coincidencias' };
    } catch (error) {
        return { success: 'error', error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
    } finally {
        await mongoose.connection.close();
    }
};

const guardarData = async function (data) {
    try {
        await mongoose.connect(mongoUrlAtlas);
        const Product = mongoose.model('Product', productSchema);
        var product = new Product(data);
        await product.save();
        return {success: true};
    } catch (error) {
        return { success: false, error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
    } finally {
        await mongoose.connection.close();
    }
};

const actualizarData = async function (data) {
    try {
        await mongoose.connect(mongoUrlAtlas);
        const Product = mongoose.model('Product', productSchema);
        const productID = data.productID;
        delete data.productID;
        for (let prop in data) {
            if (data[prop] === null || data[prop] === "") {
                delete data[prop];
            }
        }
        const result = await Product.updateOne({_id: new ObjectId(productID)}, {$set: data});
        if (result.modifiedCount !== 0) {
            return { success: true};
        } else {
            return { success: false, error_db: 'No se pudo actualizar el producto solicitado' };
        }
    } catch (error) {
        return { success: false, error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
    } finally {
        await mongoose.connection.close();
    }
};

const eliminarData = async function (data) {
    try {
        await mongoose.connect(mongoUrlAtlas);
        const Product = mongoose.model('Product', productSchema);
        const result = await Product.deleteOne({_id: new ObjectId(data.productID)});
        if (result.deletedCount === 0) {
            return { success: 'error', error_db: 'No se encontró ningún producto con el _id proporcionado' };
        }
        return { success: true };
    } catch (error) {
        return { success: 'error', error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
    } finally {
        await mongoose.connection.close();
    }
};

module.exports = {
    buscarData,
    guardarData,
    actualizarData,
    eliminarData
};