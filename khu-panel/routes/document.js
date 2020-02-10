var express = require('express')
var router = express.Router()
var documentServices = require('../services/document')
var utils = require('../services/utils')
var multer = require('multer')
var path = require('path')
var shortid = require('shortid')
const fs = require('fs')



var imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../public/upload/doc')
    },
    filename: function (req, file, cb) {
        var fileInfo = path.parse(file.originalname)
        cb(null, Date.now() + fileInfo.ext)
    }

})


var uploadImageConfig = multer({
    storage: imageStorage,
    limits: {fileSize: 50 * 1024 * 1024}
})

var uploadImage = uploadImageConfig.single('image')

var attachStroge = multer.diskStorage({
    destination: function (req, file, cb) {
        //TODO: change address*
        cb(null, __dirname + '/../../public/upload/doc')
    },
    filename: function (req, file, cb) {
        var fileInfo = path.parse(file.originalname)
        let fileName = shortid.generate() + Date.now().toString().substring(6) + fileInfo.ext
        cb(null, fileName)
    }
})

var uploadAttachCongig = multer({
    storage: attachStroge,
    limits: {fileSize: 200 * 1024 * 1024}
})
var uploadFile = uploadAttachCongig.fields([{name: 'doc', maxCount: 1}])

router.get('/all/:page-:number', utils.authentication, utils.accessControl('admin', 'r', '-'), (req, res, next) => {
    documentServices.getDocument(req.query  , parseInt(req.params.page), parseInt(req.params.number) )
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

router.get('/:docId', utils.authentication, utils.accessControl('admin', 'r', '-'), (req, res, next) => {
    documentServices.getOneDoc(req.params.docId)
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

router.post('/add' , uploadFile ,utils.authentication , utils.accessControl('admin' , 'r' , 'w') , function (req, res , next) {
    let file = req.files && req.files['doc'] ? req.files['doc'][0].filename : null

    documentServices.addDocument(
        req.body.collegeId ,
        req.body.facultyId,
        req.body.name,
        req.admin,
        file
    )
        .then((doc) => {
            res.status(200).send(doc)
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

router.post('/verification' , utils.authentication , utils.accessControl('admin' , 'r' , 'w') , function (req , res , next) {
    documentServices.activeDoc(req.body.id , req.body.active)
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

router.post('/upload/photo', utils.authentication, uploadImage, function (req, res, next) {
    var image = req.file && req.file ? req.file.filename : null
    var name = req.file && req.file ? req.file.originalname : null


    if (image != null) {
        res.status(200).send({
            address: image,
            name: name,
            success: true
        })
    }
    else {
        res.status(404).send({
            success: false,
            error: 'مشکلی در آپلود به وجود آمد، لطفا دوباره تلاش کنید'
        })
    }
});


module.exports = router
