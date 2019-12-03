const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    UserId : {
        type : mongoose.Schema.Types.ObjectId
    },
    Question_1 : {
    
        type : String
    },
    Question_2 : {
        type : String
    },
    Question_3 : {
        type : String
    },
    Question_4 : {
        type : String
    },
    Question_5_1 : {
        type : String
    },
    Question_5_2 : {
        type : String
    },
    Question_5_3 : {
        type : String
    },
    Question_5_4 : {
        type : String
    },
    Question_5_5 : {
        type : String
    },
    Question_5_6 : {
        type : String
    },
    Question_5_7 : {
        type : String
    },
})
const attendanceSchema = new Schema({
    UserId : {
        type : mongoose.Schema.Types.ObjectId
    },
    Check_in : {
        time: {
            type: Date,
            default: null,
            timezone: "Asia/Ho_Chi_Minh"
          }
    },
    Check_out : {
        time: {
            type: Date,
            default: null,
            timezone: "Asia/Ho_Chi_Minh"
          }    
    },
    Date : {
        type : Date
    }
})
const courseSchema = new Schema({
    Comment : [
        commentSchema
    ],
    Name :{
        type: String
    },
    Trainer :{
        type : String
    },  
    FromDate :{
        type : Date
    },
    ToDate :{
        type : Date
    },
    Room_ID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rooms'
    },
    Building_ID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Building'
    },
    Class: [
        {
            Name : {
                type : String
            },
            Trainer : {
                type : String
            },
            Date : {
                type : Date
            },
            From_hours : {
                type : String
            },
            To_hours : {
                type : String
            },
            Code : {
                type : String
            },
            Room_ID : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Rooms'
            },
            Building_ID : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Building'
            },
            Attendance: [
                attendanceSchema
            ],
        }
    ]
});
module.exports = Course = mongoose.model('Course' , courseSchema);
