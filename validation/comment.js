const Validator = require('validator');
const isEmty = require('../utils/isEmty');

module.exports = function ValidateCommentInput(data){
    let errors ={};

    // data.Name = !isEmty(data.Name) ? data.Name : '';
    // data.Username = !isEmty(data.Username) ? data.Username:'';
    data.Question_1 = !isEmty(data.Question_1) ? data.Question_1:'';
    data.Question_2 = !isEmty(data.Question_2) ? data.Question_2:'';
    data.Question_3 = !isEmty(data.Question_3) ? data.Question_3:'';
    data.Question_4 = !isEmty(data.Question_4) ? data.Question_4:'';
    data.Question_5_1 = !isEmty(data.Question_5_1) ? data.Question_5_1:'';
    data.Question_5_2 = !isEmty(data.Question_5_2) ? data.Question_5_2:'';
    data.Question_5_3 = !isEmty(data.Question_5_3) ? data.Question_5_3:'';
    data.Question_5_4 = !isEmty(data.Question_5_4) ? data.Question_5_4:'';
    data.Question_5_5 = !isEmty(data.Question_5_5) ? data.Question_5_5:'';
    data.Question_5_6 = !isEmty(data.Question_5_6) ? data.Question_5_6:'';
    data.Question_5_7 = !isEmty(data.Question_5_7) ? data.Question_5_7:'';
    data.UserId = !isEmty(data.UserId) ? data.UserId:'';


    // if(!Validator.isLength(data.Name , {min : 5})){
    //     errors.Name = 'Phải Dài Hơn 5 Ký Tự';
    // }
    // if(Validator.isEmpty(data.Name)){
    //     errors.Name = 'Tên không được bỏ trống';
    // }
    // if(!Validator.isLength(data.Username , {min : 5})){
    //     errors.Username = 'Phải Dài Hơn 5 Ký Tự';
    // }
    // if(Validator.isEmpty(data.Username)){
    //     errors.Username = 'Tên không được bỏ trống';
    // }
    if(!Validator.isLength(data.Question_1 , {min : 10})){
        errors.Question_1 = 'Phải Dài Hơn 10 Ký Tự';
    }
    if(Validator.isEmpty(data.Question_1)){
        errors.Question_1 = 'Câu trả lời không được bỏ trống';
    }
    if(!Validator.isLength(data.Question_2 , {min : 10})){
        errors.Question_2 = 'Phải Dài Hơn 10 Ký Tự';
    }
    if(Validator.isEmpty(data.Question_2)){
        errors.Question_2 = 'Câu trả lời không được bỏ trống';
    }
    if(!Validator.isLength(data.Question_3 , {min : 10})){
        errors.Question_3 = 'Phải Dài Hơn 10 Ký Tự';
    }
    if(Validator.isEmpty(data.Question_3)){
        errors.Question_3 = 'Câu trả lời không được bỏ trống';
    }
    if(!Validator.isLength(data.Question_4 , {min : 10})){
        errors.Question_4 = 'Phải Dài Hơn 10 Ký Tự';
    }
    if(Validator.isEmpty(data.Question_4)){
        errors.Question_4 = 'Câu trả lời không được bỏ trống';
    }
    if(Validator.isEmpty(data.Question_5_1)){
        errors.Question_5_1 = 'Câu trả lời không được bỏ trống';
    }
    if(Validator.isEmpty(data.Question_5_2)){
        errors.Question_5_2 = 'Câu trả lời không được bỏ trống';
    }
    if(Validator.isEmpty(data.Question_5_3)){
        errors.Question_5_3 = 'Câu trả lời không được bỏ trống';
    }
    if(Validator.isEmpty(data.Question_5_4)){
        errors.Question_5_4 = 'Câu trả lời không được bỏ trống';
    }
    if(Validator.isEmpty(data.Question_5_5)){
        errors.Question_5_5 = 'Câu trả lời không được bỏ trống';
    }
    if(Validator.isEmpty(data.Question_5_6)){
        errors.Question_5_6 = 'Câu trả lời không được bỏ trống';
    }
    if(Validator.isEmpty(data.Question_5_7)){
        errors.Question_5_7 = 'Câu trả lời không được bỏ trống';
    }

    return {
        errors,
        isValid : isEmty(errors)
    };
    
};