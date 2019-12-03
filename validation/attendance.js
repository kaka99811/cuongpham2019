const Validator = require('validator');
const isEmty = require('../utils/isEmty');

module.exports = function ValidateAttendanceInput(data){
    let errors ={};

    data.UserId = !isEmty(data.UserId) ? data.UserId : '';
    data.Date = !isEmty(data.Date) ? data.Date : '';


    if(Validator.isEmpty(data.UserId)){
        errors.UserId = 'ID không được bỏ trống';
    }
    if(Validator.isEmpty(data.Date)){
        errors.Date = 'không được bỏ trống';
    }
    


    return {
        errors,
        isValid : isEmty(errors)
    };
    
};