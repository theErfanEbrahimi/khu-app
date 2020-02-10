var mongoose = require('mongoose')
var Schema = mongoose.Schema

let newSchema = new  Schema({
    subject:
        {
            type: String
        },
    collegeId:
        {
            type: mongoose.Types.ObjectId
        },
    body: [
        {
            index: {
                type: Number
            },
            type: {
                type: String
            },
            charFeatures: [
                {
                    name: {
                        type: String
                    },
                    start: {
                        type: Number
                    },
                    length: {
                        type: Number
                    },
                    type: {
                        type: String
                    },
                    link: {
                        type: String
                    }
                }
            ],
            content: {
                type: String
            }
        }
    ]
    ,
    senderId:
        {
            type: mongoose.Types.ObjectId
        },
    active:
        {
            type: Boolean,
            default: false

        },
    date:
        {
            type: Date,
            default: Date.now()
        },
    cover: {
        type: mongoose.Types.ObjectId
    },
    removeFlag: {
        type: Boolean,
        default: false
    }

})



module.exports = mongoose.model('New', newSchema)