var express = require('express')
var router = express.Router()
var adminService = require('../services/admin')
var utils = require('../services/utils')

router.post('/login', (req, res, next) => {
    adminService.login(req.body.username, req.body.password)
        .then((token) => {
            let options = {
                maxAge: 1000 * 60 * 60 * 12 * 30, // would expire after 15 minutes

            }
            res.cookie('token', token, options)
            res.status(200).send({success: true})
        })
        .catch(err => {
            console.log(err)
            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.post('/register', (req, res) => {
    adminService.register(req.body.username, req.body.password)
        .then((token) => {
            res.cookie('token', token)
            res.status(200).send({success: true})
        })
        .catch(err => {
            console.log(err)
            utils.sendVerifyCode(err)

            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.get('/all/:page-:number', utils.authentication, utils.accessControl('admin', 'r', '-'), (req, res, next) => {
    adminService.getAdminList(parseInt(req.params.page), parseInt(req.params.number))
        .then((branchHead) => {
            res.status(200).send(branchHead)
        })
        .catch(err => {
            console.log(err)
            utils.sendVerifyCode(err)

            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })

})

router.post('/add', (req, res, next) => {
    adminService.addAdmin(req.body.username,
        req.body.password,
        req.body.fullName,
        req.body.email,
        req.body.phone,
        req.body.superAdmin,
        req.body.collegeId)
        .then((admin) => {
            res.status(200).send(admin)
        })
        .catch(err => {
            utils.sendVerifyCode(err)

            console.log(err)
            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.post('/verification', utils.authentication, utils.accessControl('admin', 'r', 'w'), (req, res, next) => {
    adminService.activeAdmin(req.body.id, req.body.active)
        .then(() => {
            res.status(200).send()
        })
        .catch(err => {
            console.log(err)
            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.get('/getUser/:id', utils.authentication, utils.accessControl('admin', 'r', '-'), (req, res , next) => {
    adminService.getUser(req.params.id)
        .then((admin) => {
            res.status(200).send(admin)
        })
        .catch(err => {
            console.log(err)
            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.post('/edit', utils.authentication, utils.accessControl('admin', 'r', 'w'), (req, res ,next) => {
    adminService.editAdmin(req.body.id, req.body.username, req.body.password, req.body.fullName, req.body.email, req.body.phone)
        .then(() => {
            res.status(200).send()
        })
        .catch(err => {
            console.log(err)
            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.post('/access', utils.authentication, utils.accessControl('admin', 'r', 'w'), (req, res , next) => {
    adminService.changeAccess(req.body.id, req.body.residence, req.body.tour, req.body.ticket, req.body.adminAccess, req.body.host, req.body.branch, req.body.passenger, req.body.order, req.body.profileAccess, req.body.optionAccess, req.body.blogAccess)
        .then(() => {
            res.status(200).send()
        })
        .catch(err => {
            console.log(err)
            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.get('/menu', utils.authentication, (req, res) => {
    try {
        res.status(200).send({admin: req.admin, role: req.userType})
    } catch (err) {
        res.status(500).send(err)

    }
})

router.get('/getAccess/:id', utils.authentication, utils.accessControl('admin', 'r', '-'), (req, res , next) => {
    adminService.getUser(req.params.id)
        .then((admin) => {
            res.status(200).send(admin.access)
        })
        .catch(err => {
            console.log(err)
            if (err.eText) {
                if (typeof err.eText !== 'string') {
                    err.eText = err.eText.toString()
                }
                res.status(err.eCode).send({
                    success: false,
                    error: err.eText
                })
            }
            else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.get('/logout', utils.authentication, function (req, res, next) {
    res.clearCookie('token')
    res.status(200).send({success: true})

})



module.exports = router
