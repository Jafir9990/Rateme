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
    user_id:{
        type:mongoose.Schema.Types.ObjectId

   },
 
    
    created_on: {
        type: Date,
        default: moment().format('YYYY-MM-DD')
    },
   
    modified_on: {
        type: Date,
        default: moment().format('YYYY-MM-DD')

    },
})


departmentSchema.set('toJSON', {
    getters: true,
    transform: (doc, column, options) => {
        column.created_on = moment(column.created_on).format('YYYY-MM-DD')
        column.modified_on = moment(column.modified_on).format('YYYY-MM-DD')
        return column
    }
})





 const Department = mongoose.model("departments", departmentSchema);

module.exports = Department;