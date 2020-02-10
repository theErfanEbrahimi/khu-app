const mongoose = require('mongoose')
const Admin = require('../../models/admin')


let jwt = require('jsonwebtoken')

let secretKeyAdmin = require('../../config').jwtSecretKey.secretKeyAdmin

let methods = {}

let privates = {
    generateJWT: function (admin) {
        return jwt.sign({
            admin: admin,
            role: 'admin'
        }, secretKeyAdmin)
    },
    verifyJWT: function (token, callback) {
        jwt.verify(token, secretKeyAdmin, (err, decoded) => {
            if (err) {
                callback(err)
            } else {
                callback(null, decoded.id)
            }
        })
    },
    numberUser: () => {
        return new Promise((resolve, reject) => {
            Admin.aggregate()
                .match({})
                .then((admin) => {
                    resolve(admin.length)
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err})
                })
        })

    },
    adminList: (page, number) => {
        return new Promise((resolve, reject) => {
            Admin.aggregate()
                .skip(number * (page - 1))
                .limit(number)
                .then((admin) => {
                    resolve(admin)
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err})
                })
        })

    },


}

methods.login = (username, password) => {
    return new Promise((resolve, reject) => {

        Admin.findOne({username: username, active: true})
            .then(admin => {
                if (!admin) {
                    reject({eCode: 400, eText: 'username or password incorrect!'})
                } else {
                    admin.comparePassword(password,
                        (err, isMatch) => {
                            if (err) {
                                reject({eCode: 500, eText: err})
                            } else if (!isMatch) {
                                reject({eCode: 400, eText: 'username or password incorrect'})
                            } else {
                                let token = privates.generateJWT(admin)
                                resolve({token: token})
                            }
                        })
                }
            })
            .catch(err => {
                reject({eCode: 500, eText: err})
            })
    })
}

methods.getAdminList = (page, number) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            privates.adminList(page, number),
            privates.numberUser()
        ])
            .then((result) => {
                resolve({admin: result[0], number: result[1]})
            })
            .catch((err) => {
                if (err.eText) {
                    reject(err)
                } else {
                    reject({eCode: 500, eText: err})
                }

            })
    })

}

methods.addAdmin = (username, password, fullName, email, phone, superAdmin , collegeId) => {
    return new Promise((resolve, reject) => {
        Admin.findOne({$or: [{phone: phone}, {email: email}, {username: username}]})
            .then((admin) => {
                if (admin) {
                    reject({eCode: 400, eText: 'user is exist'})
                } else {
                    let admin = new Admin();
                    admin.username = username;
                    admin.password = password;
                    admin.fullName = fullName;
                    admin.email = email;
                    admin.phone = phone;
                    admin.superAdmin = superAdmin;
                    admin.collegeId = collegeId

                    return admin.save()
                }
            })
            .then((admin) => {
                resolve(admin)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })

    })
}

methods.activeAdmin = (id, active) => {
    return new Promise((resolve, reject) => {
        Admin.updateOne({_id: mongoose.Types.ObjectId(id)}, {$set: {active: active}})
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})

            })
    })
}

methods.editAdmin = (id, username, password, fullName, email, phone, collegeId) => {
    return new Promise((resolve, reject) => {
        Admin.findOne({_id: mongoose.Types.ObjectId(id)})
            .then((admin) => {
                    let adminObj = admin
                    adminObj.username = username ? username : adminObj.username
                    adminObj.password = password ? password : adminObj.password
                    adminObj.fullName = fullName ? fullName : adminObj.fullName
                    adminObj.email = email ? email : adminObj.email
                    adminObj.phone = phone ? phone : adminObj.phone
                    adminObj.collegeId = collegeId ? collegeId : adminObj.collegeId

                    return Admin.findOenAndUpdate({_id: mongoose.Types.ObjectId(id)}, adminObj)

                }
            )
            .then((admin) => {
                resolve(admin)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })
    })

}

methods.getUser = (id) => {
    return new Promise((resolve, reject) => {
        Admin.findOne({_id: mongoose.Types.ObjectId(id)})
            .then((admin) => {
                resolve(admin)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })
    })
}

methods.changeAccess = (id, college, document, event, news, ticket, instruction) => {
    return new Promise((resolve, reject) => {
        Admin.findOne({_id: mongoose.Types.ObjectId(id)})
            .then((admin) => {
                let adminObj = admin
                adminObj.access['college'] = college
                adminObj.access['document'] = document
                adminObj.access['event'] = event
                adminObj.access['new'] = news
                adminObj.access['ticket'] = ticket
                adminObj.access['instruction'] = instruction


                return Admin.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, adminObj)
            })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })
    })
}

methods.getAccessAdminSelect = (id) => {
    return new Promise((resolve, reject) => {
        Admin.findOne({_id: mongoose.Types.ObjectId(id)})
            .then((admin) => {
                resolve({admin})
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })

    })
}


module.exports = methods
