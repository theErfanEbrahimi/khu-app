const mongoose = require('mongoose');
const College = require('../../models/college');
const Instruction = require('../../models/instruction')
const Faculty = require('../../models/faculty');

let methods = {};

let help = {
    addSingle: (name, cityId, provinceId, description) => {
        return new Promise((resolve, reject) => {
            let city = new City();
            city.name = persianjs(name).arabicChar().toString();
            city.cityId = cityId;
            city.description = description;
            city.type = 'village'
            city.provinceId = provinceId;

            city.save()
                .then((village) => {
                    resolve(village)
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err})
                })
        })
    },

}




let privets = {

    instructionList: (facultyId , page, number) => {
        return new Promise((resolve, reject) => {
            Instruction.aggregate()
                .match({facultyId: mongoose.Types.ObjectId(facultyId)})
                .sort({name: 1})
                .skip(number * (page - 1))
                .limit(number)
                .then((province) => {
                    resolve(province);
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err});
                })
        })


    },
    numberInstruction: (facultyId) => {
        return new Promise((resolve, reject) => {
            Instruction.aggregate()
                .match({facultyId: mongoose.Types.ObjectId(facultyId)})
                .then((college) => {
                    resolve(college.length);
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err})
                })
        })

    },
    numberCollege: () => {
        return new Promise((resolve, reject) => {
            College.aggregate()
                .match({})
                .then((college) => {
                    resolve(college.length);
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err})
                })
        })

    },
    facultyList: (collegeId , page, number) => {
        return new Promise((resolve, reject) => {
            Faculty.aggregate()
                .match({collegeId: mongoose.Types.ObjectId(collegeId)})
                .sort({name: 1})
                .skip(number * (page - 1))
                .limit(number)
                .then((province) => {
                    resolve(province);
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err});
                })
        })


    },
    numberFaculty: (collegeId) => {
        return new Promise((resolve, reject) => {
            Faculty.aggregate()
                .match({collegeId: mongoose.Types.ObjectId(collegeId)})
                .then((college) => {
                    resolve(college.length);
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err})
                })
        })

    },
    collegeList: (page, number) => {
        return new Promise((resolve, reject) => {
            College.aggregate()
                .match({})
                .sort({name: 1})
                .skip(number * (page - 1))
                .limit(number)
                .then((province) => {
                    resolve(province);
                })
                .catch((err) => {
                    reject({eCode: 500, eText: err});
                })
        })


    },
}



methods.editCollege = (id, name, description , logo) => {
    return new Promise((resolve, reject) => {
        College.findOne({_id: mongoose.Types.ObjectId(id)})
            .then((college) => {
                if (!college) {
                    reject({eCode: 404, eText: 'city not found'})
                }
                else {
                    let collegeObj = college;
                    collegeObj.name = name? name: collegeObj.name;
                    collegeObj.description = description ? description : collegeObj.description;
                    collegeObj.logo = logo ? logo : collegeObj.logo

                    return College.updateOne({_id: mongoose.Types.ObjectId(id)}, collegeObj)

                }
            })
            .then((college) => {
                resolve(college)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })

    })
};

methods.getCollegeList = (page, number) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            privets.collegeList(page, number),
            privets.numberCollege()
        ])
            .then((result) => {
                resolve({college: result[0], number: result[1]})
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

methods.addCollege = (name, description, logo) => {
    return new Promise((resolve, reject) => {
        let college = new College();
        college.name = name
        college.description = description;
        college.logo = logo

        college.save()
            .then((city) => {
                resolve(city)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })

    })
};

methods.addFaculty = (collegeId , name, description, logo) => {
    return new Promise((resolve, reject) => {
        let faculty = new Faculty();
        faculty.name = name
        faculty.description = description;
        faculty.logo = logo
        faculty.collegeId = collegeId

        faculty.save()
            .then((faculty) => {
                resolve(faculty)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })

    })
};

methods.getFacultyList = (collegeId , page, number) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            privets.facultyList(collegeId , page, number),
            privets.numberFaculty(collegeId)
        ])
            .then((result) => {
                resolve({faculty: result[0], number: result[1]})
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

methods.addInstruction = (collegeId , facultyId , name, description, logo) => {
    return new Promise((resolve, reject) => {
        let instruction = new Instruction();
        instruction.name = name
        instruction.description = description;
        instruction.logo = logo
        instruction.collegeId = collegeId
        instruction.facultyId = facultyId

        instruction.save()
            .then((instruction) => {
                resolve(instruction)
            })
            .catch((err) => {
                reject({eCode: 500, eText: err})
            })

    })
};

methods.getInstructionList = (facultyId , page, number) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            privets.instructionList(facultyId , page, number),
            privets.numberInstruction(facultyId)
        ])
            .then((result) => {
                resolve({instruction: result[0], number: result[1]})
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



module.exports = methods;