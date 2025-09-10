const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;

function jwtAuthenticator(sessionRequired) {
    return function (req, res, next) {
        if (!sessionRequired && !req.session.user) {
            next();
            return;
        } else if (!sessionRequired && req.session.user) {
            const token = req.session.user.token;
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
            try {
                jwt.verify(token, privateKey);
                next();
            } catch (error) {
                return res.status(403).send({ auth: false, message: 'Debe volver a iniciar sesión' });
            }
        } else {
            if(req.session.user) {
                const token = req.session.user.token;
                if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
                try {
                    jwt.verify(token, privateKey);
                    next();
                } catch (error) {
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                }
            } else {
                return res.status(401).send({ auth: false, message: 'No ha iniciado sesión.' });
            }
        }
    }
}

module.exports = { jwtAuthenticator };