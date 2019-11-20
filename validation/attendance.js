const Validator = require('validator');
const isEmty = require('../utils/isEmty');

module.exports = function ValidateAttendanceInput(data){
    let errors ={};

    data.Username = !isEmty(data.Username) ? data.Username : '';
    data.Date = !isEmty(data.Date) ? data.Date : '';
    data.Class_ID = !isEmty(data.Class_ID) ? data.Class_ID : '';


    if(!Validator.isLength(data.Username , {min : 5})){
        errors.Username = 'Phải Dài Hơn 5 Ký Tự';
    }
    if(Validator.isEmpty(data.Username)){
        errors.Username = 'Tên không được bỏ trống';
    }
    if(Validator.isEmpty(data.Date)){
        errors.Date = 'không được bỏ trống';
    }
    if(Validator.isEmpty(data.Class_ID)){
        errors.Class_ID = 'Tên không được bỏ trống';
    }

    return {
        errors,
        isValid : isEmty(errors)
    };
    
};