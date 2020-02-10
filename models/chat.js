var mongoose = require('mongoose')
var Schema = mongoose.Schema

let ticketSchema = new Schema(
    {

        text:
            {
                type: String
            },

        date:
            {
                type: Date,
                default: Date.now()
            },
        role: {
            type: String
        },
        ticketId: {
            type: mongoose.Types.ObjectId
        }

    })

module.exports = mongoose.model('Chat', ticketSchema)