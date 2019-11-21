const Validator = require('validator');
const isEmty = require('../utils/isEmty');

module.exports = function ValidateClassInput(data){
    let errors ={};

    data.Name = !isEmty(data.Name) ? data.Name : '';
    data.Trainer = !isEmty(data.Trainer) ? data.Trainer:'';
    data.Date = !isEmty(data.Date) ? data.Date:'';
    data.From_hours = !isEmty(data.From_hours) ? data.From_hours:'';
    data.To_hours = !isEmty(data.To_hours) ? data.To_hours:'';
    data.Code = !isEmty(data.Code)? data.Code:'';
    data.Room_ID = !isEmty(data.Room_ID) ? data.Room_ID:'';
    data.Building_ID = !isEmty(data.Building_ID) ? data.Building_ID:'';
    data.Wifi = !isEmty(data.Wifi) ? data.Wifi:'';


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
    if(Validator.isEmpty(data.Date)){
        errors.Date = 'Ngày không được bỏ trống';
    }
    if(Validator.isEmpty(data.From_hours)){
        errors.From_hours = 'Giờ không được bỏ trống';
    }
    if(Validator.isEmpty(data.To_hours)){
        errors.To_hours = 'Giờ không được bỏ trống';
    }
    if(Validator.isEmpty(data.Room_ID)){
        errors.Room_ID = 'ID không được bỏ trống';
    }
    if(Validator.isEmpty(data.Building_ID)){
        errors.Building_ID = 'ID không được bỏ trống';
    }
    // if(Validator.isEmpty(data.Wifi)){
    //     errors.Wifi = 'Tên không được bỏ trống';
    // }
    // if(!Validator.isLength(data.Code , {min : 4})){
    //     errors.Code = 'Phải dài hơn 4 ký tự';
    // }
    // if(Validator.isEmpty(data.Code)){
    //     errors.Code = 'không được bỏ trống';
    // }

    return {
        errors,
        isValid : isEmty(errors)
    };    
};