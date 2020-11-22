const userModel = require("../models/userModel")


const getUser = async obj =>{
    return await userModel.findOne({
        where: obj
    })
}

module.exports = {getUser}