const Validator = require('validator');
const isEmty = require('../utils/isEmty');

module.exports = function ValidateRoomInput(data){
    let errors ={};

    data.Name = !isEmty(data.Name) ? data.Name : '';
    data.Wifi = !isEmty(data.Wifi) ? data.Wifi : '';
    data.Ssid = !isEmty(data.Ssid) ? data.Ssid : '';


    if(!Validator.isLength(data.Name , {min : 5})){
        errors.Name = 'Phải Dài Hơn 5 Ký Tự';
    }
    if(Validator.isEmpty(data.Name)){
        errors.Name = 'Tên không được bỏ trống';
    }
    if(Validator.isEmpty(data.Wifi)){
        errors.Wifi = 'không được bỏ trống';
    }
    if(Validator.isEmpty(data.Ssid)){
        errors.Ssid = 'không được bỏ trống';
    }
    return {
        errors,
        isValid : isEmty(errors)
    };
};