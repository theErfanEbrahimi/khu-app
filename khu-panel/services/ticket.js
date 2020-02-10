let mongoose = require('mongoose');
let Ticket = require('../../models/ticket');
let Chat = require('../../models/chat');





let methods = {};

let privets = {
    numberTicket: (  userType , user) => {
        return new Promise((resolve, reject) => {
            let queryString = []

            if (userType === 'branchHead') {
                queryString.push({$or:[{senderId: mongoose.Types.ObjectId(user._id)} , {receiverId: mongoose.Types.ObjectId(user._id) }]})
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
            Ticket.aggregate()
                .match(queryString)
                .then((ticket) => {
                    resolve(ticket.length);
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err})
                })
        })

    },
    ticketList: (page, size  , userType , user) => {
        return new Promise((resolve, reject) => {
            let queryString = []

            if (userType === 'branchHead') {
                queryString.push({$or:[{senderId: mongoose.Types.ObjectId(user._id)} , {receiverId: mongoose.Types.ObjectId(user._id) }]})
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

            Ticket.aggregate()
                .match(queryString)
                .skip(size * (page - 1))
                .limit(size)
                .sort({dateStart: -1})
                .then((ticket) => {
                    resolve(ticket);
                })

                .catch((err) => {
                    reject({eCode: 500, eText: err});
                })
        })


    },

};

methods.ticketList = (page, number , userType , user) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            privets.numberTicket(userType , user),
            privets.ticketList(page, number , userType , user)
        ])
            .then((result) => {
                resolve({ticket: result[1], number: result[0]})

            })
            .catch((err) => {
                if (err.eText) {
                    reject(err)
                } else {
                    reject({eCode: 500, eText: err})
                }

            })
    })
};

methods.sendMessage = ( role, ticketId, message ) => {
    return new Promise((resolve, reject) => {
        Ticket.findOne({_id: mongoose.Types.ObjectId(ticketId)})
            .then((ticket) => {
                if (!ticket) {
                    reject({eCode: 404, eText: 'ticket not found'})
                } else {
                    let chat = new Chat() ;
                    chat.ticketId = ticketId ;
                    chat.text = message
                    chat.role = role.charAt(0).toUpperCase() + role.slice(1) ;
                    chat.date = Date.now()
                    return chat.save()
                }
            })
            .then((chat) => {
                resolve(chat)
            })
            .catch((err) => {
                if (err.eText) {
                    reject(err)
                } else {
                    reject({eCode: 500, eText: err})
                }

            })
    })
}

methods.getAllTicket = (user, page, number) => {
    return new Promise((resolve, reject) => {

        Ticket.aggregate()
            .match({senderId: mongoose.Types.ObjectId(user._id)})
            .skip(number * (page - 1))
            .limit(number)
            .lookup({
                from: 'passengers',
                localField: 'senderId',
                foreignField: '_id',
                as: 'senderP'
            })
            .lookup({
                from: 'hosts',
                localField: 'senderId',
                foreignField: '_id',
                as: 'senderH'
            })
            .lookup({
                from: 'branchheads',
                localField: 'senderId',
                foreignField: '_id',
                as: 'senderB'
            })
            .lookup({
                from: 'admins',
                localField: 'senderId',
                foreignField: '_id',
                as: 'senderA'
            })
            .lookup({
                from: 'departments',
                localField: 'departmentId',
                foreignField: '_id',
                as: 'department'
            })


            .then((ticket) => {
                resolve(ticket);
            })

            .catch((err) => {
                reject({eCode: 500, eText: err});
            })
    })

};

methods.getSpecTicket = (ticketId) =>   {
    let tickets ;
    return new Promise((resolve, reject) => {
        Ticket.findOne({_id: mongoose.Types.ObjectId(ticketId)})
            .then((ticket) => {
                if (!ticket) {
                    reject({eCode: 404, eText: 'ticket not found'})
                } else {
                    tickets = ticket ;
                    return Chat.find({ticketId: mongoose.Types.ObjectId(ticketId) })
                        .sort({date: 1})


                }
            })
            .then((chat) => {
                resolve({chat: chat , ticket: tickets})
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })
    })
};

methods.activeTicket = (id, active) => {
    return new Promise((resolve, reject) => {
        Ticket.updateOne({_id: mongoose.Types.ObjectId(id)}, {$set: {active: active}})
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})

            })
    })
};


module.exports = methods;