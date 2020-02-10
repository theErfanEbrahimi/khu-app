var mongoose = require('mongoose')
var Schema = mongoose.Schema

// name or education and .....
let instructionSchema = new  Schema({
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
    ,
    facultyId:  {
        type: mongoose.Types.ObjectId
    }
})



module.exports = mongoose.model('Instruction', instructionSchema)