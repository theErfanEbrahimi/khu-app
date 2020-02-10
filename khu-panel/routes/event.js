var express = require('express')
var router = express.Router()
var eventService = require('../services/event')
var utils = require('../services/utils')
var multer = require('multer')
var path = require('path')
var shortid = require('shortid')
const fs = require('fs')

var imageFilter = function (req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
        return callback(new Error('Only image files are allowed!'), false)
    }
    callback(null, true)
}


var imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../public/upload/blog')
    },
    filename: function (req, file, cb) {
        var fileInfo = path.parse(file.originalname)
        cb(null, Date.now() + fileInfo.ext)
    }

})


var uploadImageConfig = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: {fileSize: 50 * 1024 * 1024}
})

var uploadImage = uploadImageConfig.single('image')

var attachStroge = multer.diskStorage({
    destination: function (req, file, cb) {
        //TODO: change address*
        cb(null, __dirname + '/../../public/upload/cover')
    },
    filename: function (req, file, cb) {
        var fileInfo = path.parse(file.originalname)
        let fileName = shortid.generate() + Date.now().toString().substring(6) + fileInfo.ext
        cb(null, fileName)
    }
})
var attachFilter = function (req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG|docx|text|doc|txt|pdf)$/i)) {
        return callback(new Error('Only image and files are allowed!'), false)
    }
    callback(null, true)
}
var uploadAttachCongig = multer({
    storage: attachStroge,
    fileFilter: attachFilter,
    limits: {fileSize: 200 * 1024 * 1024}
})
var uploadFile = uploadAttachCongig.fields([{name: 'cover', maxCount: 1}])

router.get('/all/:page-:number', utils.authentication, utils.accessControl('admin', 'r', '-'), (req, res, next) => {
    eventService.getBlogList(parseInt(req.params.page), parseInt(req.params.number) , req.query , req.admin , req.userType)
        .then((branchHead) => {
            res.status(200).send(branchHead)
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

router.post('/add' , uploadFile ,utils.authentication , utils.accessControl('admin' , 'r' , 'w') , function (req, res , next) {
    let cover = req.files && req.files['cover'] ? req.files['cover'][0].filename : null

    eventService.addPost(
        req.body.title ,
        req.body.body,
        req.admin,
        req.userType,
        req.body.collegeId,
       cover
    )
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

router.post('/verification' , utils.authentication , utils.accessControl('admin' , 'r' , 'w') , function (req , res , next) {
    eventService.activeEvent(req.body.id , req.body.active)
        .then(() => {
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

router.get('/:eventId', utils.authentication, utils.accessControl('admin', 'r', '-'), (req, res, next) => {
    eventService.getPost(req.params.eventId)
        .then((post) => {
            res.status(200).send(post)
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

router.post('/edit' , uploadFile ,utils.authentication , utils.accessControl('admin' , 'r' , 'w') , function (req, res , next) {
    let cover = req.files && req.files['cover'] ? req.files['cover'][0].filename : null

    eventService.editPost(
        req.body.id,
        req.body.title ,
        req.body.body,
        req.admin._id,
        req.userType,
        req.body.collegeId,
        cover
    )
        .then((news) => {
            res.status(200).send(news)
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


module.exports = router
