function roleAuthenticator(role) {
    return function(req, res, next) {
        if(req.session.user) {
            if(req.session.user.userRolType === role) {
                next();
            } else {
                return res.status(403).send({message: 'Usted no está autorizado para acceder a este recurso'});
            }
        } else {
            return res.status(403).send({message: 'Debe iniciar sesión'});
        }
    }
}

module.exports = { roleAuthenticator };