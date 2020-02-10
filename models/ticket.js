var mongoose = require('mongoose')
var Schema = mongoose.Schema

let ticketSchema = new Schema(
    {
        subject:
            {
                type: String
            },
        email:
            {
                type: String
            },
        phone:
            {
                type: String
            },
        collegeId:
            {
                type: mongoose.Types.ObjectId
            },
        text:
            {
                type: String
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

module.exports = mongoose.model('Ticket', ticketSchema)