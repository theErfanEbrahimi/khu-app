var mongoose = require('mongoose')
var Schema = mongoose.Schema


var pictureSchema = new Schema({
    name: {
        type: String
    },
    type: {//residence, event, memory, blog , location
        type: String
    },
    photographerId: {
        type: Schema.Types.ObjectId,
    },
    photographerType: {//boomban , passenger, branch Head, admin(moderator)
        type: String
    },


    eventId: {
        type: Schema.Types.ObjectId,
    },


    date: {
        type: Date,
        default:
        Date.now
    }
    ,
    verify: {
        type: Boolean,
        default: false
    }
    ,
    description: {
        type: String
    },

    fileName:
        {
            type: String
        },
    format: {
        type: String,
        default: 'picture'
    },
    primary: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Picture', pictureSchema)
