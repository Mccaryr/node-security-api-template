const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    //check jwt exists and is verified
    
    if(token) {
        jwt.verify(token, 'robs super secret secret', (err, decodedToken) => {
            if(err) {
                res.send(403).json({message: "Invalid Token"})
            } else {
                next();
            }
        })
    } else {
        res.status(403).json({message: "Invalid Token"})
    }
}

module.exports = { requireAuth }