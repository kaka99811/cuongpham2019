const Validator = require('validator');
const isEmty = require('../utils/isEmty');

module.exports = function ValidateCourseInput(data){
    let errors ={};

    data.Name = !isEmty(data.Name) ? data.Name : '';
    data.Trainer = !isEmty(data.Trainer) ? data.Trainer:'';
    data.FromDate = !isEmty(data.FromDate) ? data.FromDate:'';
    data.ToDate = !isEmty(data.ToDate) ? data.ToDate:'';

    

    if(!Validator.isLength(data.Name , {min : 5})){
        errors.Name = 'Phải Dài Hơn 5 Ký Tự';
    }
    if(Validator.isEmpty(data.Name)){
        errors.Name = 'Tên không được bỏ trống';
    }
    if(!Validator.isLength(data.Trainer , {min : 5})){
        errors.Trainer = 'Phải dài hơn 5 ký tự';
    }
    if(Validator.isEmpty(data.Trainer)){
        errors.Trainer = 'Tên không được bỏ trống';
    }
    if(Validator.isEmpty(data.FromDate)){
        errors.FromDate = 'không được bỏ trống';
    }
    if(Validator.isEmpty(data.ToDate)){
        errors.ToDate = 'không được bỏ trống';
    }

    return {
        errors,
        isValid : isEmty(errors)
    };
    
    
};