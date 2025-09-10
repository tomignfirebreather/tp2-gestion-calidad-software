const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoUrlAtlas = process.env.MONGO_URL_ATLAS;
const privateKey = process.env.PRIVATE_KEY;

const userSchema = new Schema({
    userName: { type: String, index: true, required: true } ,
    userEmail: { type: String, index: true, required: true },
    userPass: { type: String, required: true },
    userRolType: { type: String, index: true, required: true },
    dateCreated: { type: Date, default: Date.now }
})

const validarData = async function (userName, userEmail, userPass, userPassConfirm) {
    if (userPass === userPassConfirm) {
        try {
            await mongoose.connect(mongoUrlAtlas);
            const User = mongoose.model('User', userSchema);
            if(await User.findOne({userEmail}) == null){
                if(await User.findOne({userName}) == null){
                    return { success: true };
                } else {return { success: false, error: 'Este nombre de usuario ya está en uso' }}
            } else {return { success: false, error: 'Este email ya está en uso' }}
        } catch (error) {
            return { success: false, error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
        } finally {
            await mongoose.connection.close();
        }
    } else {
        return { success: false, error: 'Las contraseñas no coinciden' };
    }
};

const guardarPerfil = async function (userName, userEmail, userPass, userRolType) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(userPass, salt);
        await mongoose.connect(mongoUrlAtlas);
        const User = mongoose.model('User', userSchema);
        await User.create({
            userName,
            userEmail,
            userPass: hashPass,
            userRolType
        });
        return {success: true};
    } catch (error) {
        return { success: false, error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
    } finally {
        await mongoose.connection.close();
    }
};

const validarPerfil = async function (userEmail, userPass) {
    try {
        await mongoose.connect(mongoUrlAtlas);
        const User = mongoose.model('User', userSchema);
        const userInfo = await User.findOne({userEmail});
        if(userInfo !== null){
            if(await bcrypt.compare(userPass, userInfo.userPass)){
                return { success: true, userName: userInfo.userName, userEmail: userInfo.userEmail, userRolType: userInfo.userRolType};
            } else {return { success: false, error: 'Contraseña incorrecta' }}
        } else {return { success: false, error: 'No se registra un perfil con ese email' }}
    } catch (error) {
        return { success: false, error_db: 'Ocurrio un error al conectarse a MongoDB: ' + error };
    } finally {
        await mongoose.connection.close();
    }
};

const generarJWT = async function (userEmail) {
    var token = jwt.sign(
        {userEmail},
        privateKey,
        {expiresIn: '1h'}
    );
    return token;
};

module.exports = {
    validarData,
    guardarPerfil,
    validarPerfil,
    generarJWT
};