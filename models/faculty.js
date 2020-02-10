var mongoose = require('mongoose')
var Schema = mongoose.Schema

let collegeSchema = new  Schema({
    name:
        {
            type: String
        },
    major:
    [
        {
            type: mongoose.Types.ObjectId
        }
    ],
    description:{
        type: String
    },
    logo: {
        type: String
    },
    collegeId:  {
        type: mongoose.Types.ObjectId
    }


})



module.exports = mongoose.model('Faculty', collegeSchema)