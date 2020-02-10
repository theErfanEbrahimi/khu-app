const mongoose = require('mongoose');
const Document = require('../../models/document');
const persianjs = require('persianjs')


let methods = {};





let privets = {
    documentList: (query , page ,  size) => {
        return new Promise((resolve, reject) => {
            let queryString = []
            let queryMatch = {}
            let text;

            if (query.text) {
                text = persianjs(query.text.trim()).arabicChar().toString()

                queryString.push({
                    $or: [
                        {
                            'passenger.firstName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passenger.lastName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passenger.codeMeli': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passenger.phone': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.firstName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.lastName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.codeMeli': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.phone': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        }


                    ]
                })

            }

            if (query.status !== 'null') {
                queryString.push({
                    status: query.status
                })
            }


            if (queryString.length) {
                queryString = {$and: queryString}
            }
            else if (queryString[0]) {
                queryString = queryString[0]
            }
            else {
                queryString = {}
            }

            console.log(JSON.stringify(queryString))
            Document.aggregate()
                .match(queryString)
                .sort({date: -1})
                .skip(size * (page - 1))
                .limit(size)
                .lookup({
                    from: 'admins',
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'authors'
                })

                .lookup({
                    from: 'colleges',
                    localField: 'collegeId',
                    foreignField: '_id',
                    as: 'college'
                })
                .lookup({
                    from: 'faculties',
                    localField: 'facultyId',
                    foreignField: '_id',
                    as: 'faculty'
                })

                .then((document) => {
                    resolve(document);
                })

                .catch((err) => {
                    reject({eCode: 500, eText: err});
                })
        })

    },
    documentnumber: (query , page ,  size) => {
        return new Promise((resolve, reject) => {
            let queryString = []
            let queryMatch = {}
            let text;

            if (query.text) {
                text = persianjs(query.text.trim()).arabicChar().toString()

                queryString.push({
                    $or: [
                        {
                            'passenger.firstName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passenger.lastName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passenger.codeMeli': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passenger.phone': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.firstName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.lastName': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.codeMeli': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        },
                        {
                            'passengerHost.phone': {
                                $regex: '.*' + text + '.*',
                                $options: 'i'
                            }
                        }


                    ]
                })

            }

            if (query.status !== 'null') {
                queryString.push({
                    status: query.status
                })
            }


            if (queryString.length) {
                queryString = {$and: queryString}
            }
            else if (queryString[0]) {
                queryString = queryString[0]
            }
            else {
                queryString = {}
            }

            console.log(JSON.stringify(queryString))
            Document.aggregate()
                .match(queryString)
                .lookup({
                    from: 'colleges',
                    localField: 'collegeId',
                    foreignField: '_id',
                    as: 'college'
                })
                .lookup({
                    from: 'faculties',
                    localField: 'facultyId',
                    foreignField: '_id',
                    as: 'faculty'
                })

                .then((document) => {
                    resolve(document.length);
                })

                .catch((err) => {
                    reject({eCode: 500, eText: err});
                })
        })

    }


}

methods.addDocument = (collegeId , facultyId  , title , user , file) => {
    return new Promise((resolve , reject) => {
        let document = new  Document()
        console.log(collegeId )
        document.name = title ;
        document.collegeId = collegeId ;
        document.facultyId = facultyId ;
        document.senderId = user._id ;
        document.file = file
        document.save()
            .then((document) => {
                resolve(document)
            })
            .catch((err) => {
                if (err.eText) {
                    reject(err)
                }
                else {
                    reject({eCode: 500, eText: err})
                }

            })


    })
}

methods.getDocument = (query , page , number) => {
    return new  Promise ((resolve , reject) => {
        Promise.all([
            privets.documentList(query , page, number),
            privets.documentnumber(query , page , number)
        ])
            .then((result) => {
                resolve({document: result[0], number: result[1]})
            })
            .catch((err) => {
                if (err.eText) {
                    reject(err)
                }
                else {
                    reject({eCode: 500, eText: err})
                }

            })

        }
    )
}

methods.getOneDoc = (id) => {
    return new Promise((resolve , reject) => {
        Document.findOne({_id: mongoose.Types.ObjectId(id)})
            .then((document) => {
                resolve(document)
            })
            .catch((err) => {
                if (err.eText) {
                    reject(err)
                }
                else {
                    reject({eCode: 500, eText: err})
                }

            })

    })
}

methods.activeDoc = (id, active) => {
    return new Promise((resolve, reject) => {
        Document.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set: {active: active}})
            .then((doc) => {
                resolve(doc)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})

            })
    })
};





module.exports = methods;