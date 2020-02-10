const mongoose = require('mongoose');
const Post = require('../../models/event');
const persianjs = require('persianjs')
const Picture = require('../../models/picture');


let methods = {};

let privets =
    {
        getBlogList: (page, number, query, user, userType) => {
            return new Promise((resolve, reject) => {
                let queryString = [], sort = {}

                if (query.text) {
                    text = persianjs(query.text.trim()).arabicChar().toString()
                    queryString.push({
                        title: {
                            $regex: '.*' + text + '.*',
                            $options: 'i'
                        }
                    })
                }

                if (query.categoryId) {
                    queryString.push({
                        categoryId: mongoose.Types.ObjectId(query.categoryId)
                    })
                }
                if (userType === 'branchHead') {
                    queryString.push({author: mongoose.Types.ObjectId(user._id)})
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
                Post.aggregate()
                    .match(queryString)
                    .match({removeFlag: false})
                    .sort({date: -1})
                    .skip(number * (page - 1))
                    .limit(number)
                    .lookup({
                        from: 'admins',
                        localField: 'senderId',
                        foreignField: '_id',
                        as: 'authors'
                    })

                    .then((post) => {
                        resolve(post);
                    })
                    .catch((err) => {
                        reject({eCode: 500, eText: err});
                    })
            })
        },
        numberList: (query, user, userType) => {
            return new Promise((resolve, reject) => {
                let queryString = [], sort = {}

                if (query.text) {
                    text = persianjs(query.text.trim()).arabicChar().toString()
                    queryString.push({
                        title: {
                            $regex: '.*' + text + '.*',
                            $options: 'i'
                        }
                    })
                }

                if (query.categoryId) {
                    queryString.push({
                        categoryId: mongoose.Types.ObjectId(query.categoryId)
                    })
                }
                if (userType === 'branchHead') {
                    queryString.push({author: mongoose.Types.ObjectId(user._id)})
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
                Post.aggregate()
                    .match(queryString)
                    .match({removeFlag: false})
                    .then((post) => {
                        resolve(post.length);
                    })
                    .catch((err) => {
                        reject({eCode: 500, eText: err})
                    })
            })

        },
        saveCover: (blogId, filename) => {
            return new Promise((resolve, reject) => {
                let picture = new Picture()
                picture.type = 'event'
                picture.eventId = blogId
                picture.fileName = filename
                picture.save()
                    .then((picture) => {
                        resolve(picture)
                    })
                    .catch((err) => {
                        reject({eCode: 500, eText: err})
                    })

            })
        },

    }

methods.addPost = (title, body, author, role, collegeId, cover) => {
    return new Promise((resolve, reject) => {
        let post = new Post();

        if (body && typeof body === 'string') {
            body = JSON.parse(body)
        }

        Promise.all([
            privets.saveCover(post._id, cover),
        ])
            .then((result) => {
                let cover = result[0]
                post.subject = title;
                post.senderId = author;
                post.body = body;
                post.role = role.charAt(0).toUpperCase() + role.slice(1);
                post.collegeId = collegeId;
                post.cover = cover._id
                body.map((item) => {
                    if (item.type === 'right' || item.type === 'text') {
                        post.description = item.content
                    }

                })

                return post.save()
            })

            .then((post) => {
                resolve(post)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })

    })
};

methods.getBlogList = (page, number, query, user, userType) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            privets.getBlogList(page, number, query, user, userType),
            privets.numberList(query, user, userType)
        ])
            .then((result) => {
                resolve({blog: result[0], number: result[1]})
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

};

methods.getPost = (id) => {
    return new Promise((resolve, reject) => {
        Post.aggregate()
            .match({_id: mongoose.Types.ObjectId(id)})
            .lookup({
                from: 'admins',
                localField: 'author',
                foreignField: '_id',
                as: 'authors'
            })

            .then((post) => {
                resolve(post);
            })
            .catch((err) => {
                reject({eCode: 500, eText: err});
            })
    })
}

methods.editPost = (blogId, title, body, author, role, collegeId, cover) => {

    if (body && typeof body === 'string') {
        body = JSON.parse(body)
    }

    let coverEdit;
    return new Promise((resolve, reject) => {
        Promise.all([
            cover ? privets.saveCover(blogId, cover) : false,

        ])
            .then((result) => {
                let cover = result[0]
                coverEdit = cover._id
                return Post.findOne({_id: mongoose.Types.ObjectId(blogId)})
            })
            .then((post) => {
                let postObj = post
                postObj.subject = title ? title : postObj.subject;
                postObj.author = author ? author : postObj.author;
                postObj.body = body;

                postObj.role = role.charAt(0).toUpperCase() + role.slice(1) ? role.charAt(0).toUpperCase() + role.slice(1) : postObj.role
                body.map((item) => {
                    if (item.type === 'right' || item.type === 'text') {
                        postObj.description = item.content
                    }

                })
                postObj.collegeId = collegeId ? collegeId : postObj.collegeId
                if (coverEdit) {
                    postObj.cover = coverEdit;
                }
                else {
                    coverEdit = postObj.cover;
                }
                console.log(coverEdit)
                return Post.findOneAndUpdate({_id: mongoose.Types.ObjectId(blogId)}, postObj)
            })


            .then((post) => {
                resolve(post)
            })

            .catch((err) => {
                reject({eCode: 500, eText: err})
            })


    })
};

methods.activeEvent = (id, active) => {
    return new Promise((resolve, reject) => {
        Post.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set: {active: active}})
            .then((post) => {
                resolve(post)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})

            })
    })
};

methods.removeBlog = (id) => {
    return new Promise((resolve, reject) => {
        Post.findOne({_id: mongoose.Types.ObjectId(id)})
            .then((blog) => {
                    if (!blog) {
                        reject({eCode: 404, eText: 'blog not  found'})
                    }
                    else {
                        return Post.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set: {removeFlag: true}})
                    }
                }
            )
            .then(() => {
                resolve()
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

module.exports = methods;