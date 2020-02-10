const Admin = require('../../models/admin')


let config = require('../../config')
// let adminBot = require('../../adminBotPanel')


const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

let methods = {}

methods.verifyJWT = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        try {
            let decoded = jwt.verify(token, secretKey)
            resolve(decoded)
        } catch (err) {
            reject(err)
        }
    })
}

methods.authentication = (req, res, next) => {
    let token = req.cookies.token;
    if (token) {
        methods.verifyJWT(token.token, config.jwtSecretKey.secretKeyAdmin)
            .then((token) => {
                Admin.findOne({_id: mongoose.Types.ObjectId(token.admin._id)})
                    .then((admin) => {
                        if (!admin) {
                            res.status(401).send({
                                'error': 'unauthorized'
                            });
                        } else {
                            req.admin = admin;
                            req.userType = 'admin'
                            next()
                        }
                    })
                    .catch((err) => {
                        res.status(500).send({
                            'error': err.toString()
                        })
                    })


            })

    } else {
        res.status(401).send({
            'error': 'unauthorized'
        });
    }

}

methods.accessControl = (access, read, write1) => {
    return function (req, res, next) {

        if (req.admin.superAdmin === true) {
            next()
        } else if (req.userType === 'branchHead') {
            next()

        } else if (req.userType === 'org') {
            res.status(403).send('access denied')

        } else {
            let write = req.admin.access[access][1];

            if ((req.admin.access[access][0] === read)) {
                if ((write === 'w') || (req.admin.access[access][1] === write1)) {
                    next()
                } else {
                    res.status(403).send('access denied')

                }
            } else {

                res.status(403).send('access denied')
            }
        }


    }

};

methods.generateJWT = (payload, secretKey) => {
    let token
    token = jwt.sign(payload, secretKey)
    return token
}

methods.generateVerifyCode = (digitNum) => {
    var code = ''
    for (var i = 0; i < digitNum; i++) {
        code += Math.floor(Math.random() * 10)
    }
    return code
}

module.exports = methods
