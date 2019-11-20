const Validator = require('validator');
const isEmty = require('../utils/isEmty');

module.exports = function ValidateBuildingInput(data){
    let errors ={};

    data.Name = !isEmty(data.Name) ? data.Name : '';

    if(!Validator.isLength(data.Name , {min : 5})){
        errors.Name = 'Phải Dài Hơn 5 Ký Tự';
    }
    if(Validator.isEmpty(data.Name)){
        errors.Name = 'Tên không được bỏ trống';
    }

    return {
        errors,
        isValid : isEmty(errors)
    };
    
};