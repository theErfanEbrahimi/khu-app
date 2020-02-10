var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

var adminSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    collegeId: {
        type: mongoose.Types.ObjectId
    },
    access:
        {
            admin: {

                type: String,
                default: '--'
            },
            college: {
                type: String,
                default: '--'
            },
            document: {
                type: String,
                default: '--'
            },
            instruction: {
                type: String,
                default: '--'
            },
            new: {
                type: String,
                default: '--'
            },
            ticket: {
                type: String,
                default: '--'
            },
            event: {
                type: String,
                default: '--'
            }

        },
    superAdmin:
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


adminSchema.pre('save', function (next) {
    var admin = this
    if (this.password && (this.isModified('password') || this.isNew)) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(admin.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err)
                }
                admin.password = hash
                // admin.resetPassNeeded = false
                // admin.passwordVersion++
                // admin.pushId = []
                next()
            })
        })
    } else {
        return next()
    }
})

adminSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err)
        }
        return cb(null, isMatch)
    })
}

module.exports = mongoose.model('Admin', adminSchema)