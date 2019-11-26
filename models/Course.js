const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = new Schema({
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
    // Room_Name : {
    //     type : String
    // },
    // Building_Name : {
    //     type : String
    // },
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
    //             Room_Name : {
    //     type : String
    // },
    // Building_Name : {
    //     type : String
    // },
            Wifi : {
                type : String
            }
        }
    ],
    Comment : [
        {
            Username : {
                type : String
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
        }
    ],
    Attendance: [
        {
            Username : {
                type : String
            },
            Check_in : {
                type : Date
            },
            Check_out : {
                type : Date
            },
            Date : {
                type : Date
            },
            Class_ID : {
                type : mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        }
    ]
});
module.exports = Couser = mongoose.model('Course' , courseSchema);