var express = require('express');
var router = express.Router();
var collegeService = require('../services/college') ;
var utils = require('../services/utils');
var multer = require('multer')
var path = require('path')
var fs = require('fs')


var imageFilter = function (req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
        return callback(new Error('Only image files are allowed!'), false)
    }
    callback(null, true)
}

var imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../public/upload/college')
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
});

var uploadImage = uploadImageConfig.array('logo', 1);

router.post('/add' , uploadImage , utils.authentication , utils.accessControl('college', 'r', 'w') , (req , res , next) => {
    var image = req.files && req.files[0] ? req.files[0].filename : null

    collegeService.addCollege(req.body.name ,
        req.body.description,
        image)
        .then((college) => {
            res.status(200).send(college) ;
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
            } else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.post('/edit' , uploadImage , utils.authentication , utils.accessControl('college', 'r', 'w') , (req , res , next) => {
    var image = req.files && req.files[0] ? req.files[0].filename : undefined

    collegeService.editCollege(req.body.id , req.body.name , req.body.description , image)
        .then((college) => {
            res.status(200).send(college) ;
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
            } else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.post('/faculty/add' , uploadImage , utils.authentication , utils.accessControl('college', 'r', 'w') , (req , res , next) => {
    var image = req.files && req.files[0] ? req.files[0].filename : null

    collegeService.addFaculty(
        req.body.collegeId,
        req.body.name ,
        req.body.description,
        image)
        .then((faculty) => {
            res.status(200).send(faculty) ;
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
            } else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.post('/instruction/add' , uploadImage , utils.authentication , utils.accessControl('college', 'r', 'w') , (req , res , next) => {
    var image = req.files && req.files[0] ? req.files[0].filename : null

    collegeService.addInstruction(
        req.body.collegeId,
        req.body.faculty,
        req.body.name ,
        req.body.description,
        image)
        .then((faculty) => {
            res.status(200).send(faculty) ;
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
            } else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })
})

router.get('/all/:page-:number', utils.authentication  , utils.accessControl('college', 'r', '-')  , (req , res ,  next) => {
    collegeService.getCollegeList(parseInt(req.params.page) , parseInt(req.params.number))
        .then((college) => {
            res.status(200).send(college) ;
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
            } else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })

}) ;

router.get('/faculty/all/:collegeId/:page-:number', utils.authentication  , utils.accessControl('college', 'r', '-')  , (req , res ,  next) => {
    collegeService.getFacultyList(req.params.collegeId,parseInt(req.params.page) , parseInt(req.params.number))
        .then((college) => {
            res.status(200).send(college) ;
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
            } else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })

}) ;

router.get('/instruction/all/:facultyId/:page-:number', utils.authentication  , utils.accessControl('college', 'r', '-')  , (req , res ,  next) => {
    collegeService.getFacultyList(req.params.facultyId,parseInt(req.params.page) , parseInt(req.params.number))
        .then((college) => {
            res.status(200).send(college) ;
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
            } else {
                res.status(500).send({
                    success: false,
                    error: err.toString()
                })
            }

        })

}) ;

module.exports = router ;