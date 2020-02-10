var mongoose = require('mongoose')
var Schema = mongoose.Schema

let documentSchema = new Schema({
    name:
        {
            type: String
        },
    collegeId:
        {
            type: mongoose.Types.ObjectId
        },
    facultyId:
        {
            type: mongoose.Types.ObjectId
        },
    file:
        {
            type: String
        },
    senderId:
        {
            type: mongoose.Types.ObjectId
        },
    like:
        {
            type: Number,
            default: 0

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
        }


})


module.exports = mongoose.model('Document', documentSchema)