const moment = require("moment/moment");
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        maxlength: 20,
    },
    logo: {
        type: String,
        
    },
    adress: {
        type: String,
        

    },
    rating: {
        type: Number,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId

   },
    createdOn: {
        type: Date,
        default: moment().format('YYYY-MM-DD')
    },
   
    modifiedOn: {
        type: Date,
        default: moment().format('YYYY-MM-DD')

    },
})


departmentSchema.set('toJSON', {
    getters: true,
    transform: (doc, column, options) => {
        column.createdOn = moment(column.createdOn).format('YYYY-MM-DD')
        column.modifiedOn = moment(column.modifiedOn).format('YYYY-MM-DD')
        return column
    }
})





 const Department = mongoose.model("departments", departmentSchema);

module.exports = Department;