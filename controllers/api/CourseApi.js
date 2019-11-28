const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Building = require('../../models/Building');
const Course = require('../../models/Course');
const Account = require('../../models/account');


const { MyError } = require('../../utils/myError');

const validateClassInput = require('../../validation/class');
const validateCommentInput = require('../../validation/comment');
const validateCourseInput = require('../../validation/course');
const validateAttendanceInput = require('../../validation/attendance');

router.get('/', async (req, res) => {
    let result = []
    getRoomName = async (id) => {
        const building = await Building.findOne(
            { 'Rooms._id': { $eq: id } }
        )
        console.log(1, building.Rooms)
        let room = building.Rooms.filter(room => room._id.toString() === id.toString())
        return room[0].Name
    }
    Course.find()
        .populate('Building_ID', { Name: 'Name' })
        .sort({ _id: -1 })
        .then(async courses => {
            for (const course of courses) {
                result.push({
                    _id: course._id,
                    Name: course.Name,
                    Trainer: course.Trainer,
                    FromDate: course.FromDate,
                    ToDate: course.ToDate,
                    Room_ID: course.Room_ID,
                    Room_Name: await getRoomName(course.Room_ID),
                    Building_ID: course.Building_ID
                })
            }
            res.json({
                resultCode: 1,
                message: 'lay du lieu thanh cong',
                data: result
            })
        })
        .catch(err => {
            console.log(err)
            res.json({
                resultCode: -1,
                message: 'lay du lieu khong thanh cong',
                data: 0
            })
        })
});
router.get('/comment/courseId=:courseId', (req, res) => {
    async function getClass(idCourse) {
        if (!idCourse) {
            throw new MyError('Sai id', 400);
        }
        const { Comment } = await Course.findById(idCourse, { Comment: 1 });
        return { Comment };
    }
    getClass(req.params.courseId)
        .then(Comment => res.json({
            resultCode: 1,
            message: ' thành công ',
            data: Comment
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: ' k thành công ',
            data: 0
        }))

});
router.get('/class/courseId=:courseId', async (req, res) => {
    let result = []
    getRoomName = async (id) => {
        const building = await Building.findOne(
            { 'Rooms._id': { $eq: id } }
        )
        console.log(1, building.Rooms)
        let room = building.Rooms.filter(room => room._id.toString() === id.toString())
        return room[0].Name
    }
    getBuildingName = async (id) => {
        const building1 = await Building.findOne(
            { '_id': { $eq: id } }
        )
        console.log(1, building1)
        return building1.Name
    }
    Course.findOne({
        _id: req.params.courseId
    }).sort({ _id: -1 })
        .then(async classes => {
            console.log(classes)
            for (const classs of classes.Class) {
                result.push({
                    Name: classs.Name,
                    Trainer: classs.Trainer,
                    Date: classs.Date,
                    From_hours: classs.From_hours,
                    To_hours: classs.To_hours,
                    Room_ID: classs.Room_ID,
                    Room_Name: await getRoomName(classs.Room_ID),
                    Building_ID: classs.Building_ID,
                    Building_Name: await getBuildingName(classs.Building_ID),
                    Code: classs.Code,
                    classes: classs.Class
                })
            }
            res.json({
                resultCode: 1,
                message: 'lay du lieu thanh cong',
                data: result
            })
        })
        .catch(err => {
            console.log(err)
            res.json({
                resultCode: -1,
                message: ' k thành công ',
                data: 0
            })
        })
});
router.post('/create', (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body);
    //kiem tra va bao loi
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const courseFields = {};
    if (req.body.Name) courseFields.Name = req.body.Name
    if (req.body.Trainer) courseFields.Trainer = req.body.Trainer
    if (req.body.FromDate) courseFields.FromDate = req.body.FromDate
    if (req.body.ToDate) courseFields.ToDate = req.body.ToDate
    if (req.body.Room_ID) courseFields.Room_ID = req.body.Room_ID
    if (req.body.Building_ID) courseFields.Building_ID = req.body.Building_ID

    Course.findOne({ Name: req.body.Name })
        .then(course => {
            if (course) {
                // báo lỗi đã tồn tại
                return res.json({
                    resultCode: -1,
                    message: 'Tên khóa học đã được sử dụng',
                    data: 0
                });
            } else {
                // create
                // lưu khóa học vừa tạo
                new Course(courseFields).save().then(course => res.json({
                    resultCode: 1,
                    message: 'Tạo mới khóa học thành công',
                    data: course
                }));
            }
        });

});
router.post('/courseId=:courseId', (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body);
    // kiểm tra và báo lỗi
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const courseFields = {};
    if (req.body.Name) courseFields.Name = req.body.Name;
    if (req.body.Trainer) courseFields.Trainer = req.body.Trainer
    if (req.body.FromDate) courseFields.FromDate = req.body.FromDate
    if (req.body.ToDate) courseFields.ToDate = req.body.ToDate
    if (req.body.Room_Name) courseFields.Room_Name = req.body.Room_Name
    if (req.body.Building_Name) courseFields.Building_Name = req.body.Building_Name
    Course.findOne({ _id: req.params.courseId })
        .then(course => {
            if (!course) {
                // báo lỗi không tồn tại
                return res.status(400).json({
                    resultCode: -1,
                    message: 'Không tìm thấy khóa học này',
                    data: 0
                });
            } else {
                Course.findByIdAndUpdate({ _id: req.params.courseId }, { $set: courseFields }, { new: true })
                    .then(course => res.json({
                        resultCode: 1,
                        message: 'Trùng tên',
                        data: 0
                    }));
            }
        });
});
router.post('/courseId=:courseId/addclass', (req, res) => {
    async function createClass(idCourse, data) {
        const course = await Course.findOne({ _id: idCourse });
        if (!course) throw new MyError('Course not found', 404);
        const newClass = {
            Name: data.Name,
            Trainer: data.Trainer,
            Date: data.Date,
            From_hours: data.From_hours,
            To_hours: data.To_hours,
            Room_ID: data.Room_ID,
            Building_ID: data.Building_ID,
            Code: Math.floor(1000 + Math.random() * 9000),
            Wifi: data.Wifi,
            // User_Id : data.User_Id
        }

        // add room to array
        course.Class.unshift(newClass);
        course.save();
        return newClass;
    }
    const { errors, isValid } = validateClassInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    createClass(req.params.courseId, req.body)
        .then(Class => res.send({
            resultCode: 1,
            message: 'Tạo mới thành công',
            data: Class
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data: 0
        }));
});
router.post('/courseId=:courseId/addcomment', (req, res) => {
    async function createComment(idCourse, data) {
        const course = await Course.findOne({ _id: idCourse });
        if (!course) throw new MyError('Course not found', 404);
        const newComment = {
            UserId : data.UserId,
            Question_1: data.Question_1,
            Question_2: data.Question_2,
            Question_3: data.Question_3,
            Question_4: data.Question_4,
            Question_5_1: data.Question_5_1,
            Question_5_2: data.Question_5_2,
            Question_5_3: data.Question_5_3,
            Question_5_4: data.Question_5_4,
            Question_5_5: data.Question_5_5,
            Question_5_6: data.Question_5_6,
            Question_5_7: data.Question_5_7
        }
        // add room to array
        course.Comment.unshift(newComment);
        course.save();
        return newComment;
    }
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    createComment(req.params.courseId, req.body)
        .then(Comment => res.send({
            resultCode: 1,
            message: 'Tạo mới thành công',
            data: Comment
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data: 0
        }));
});
router.post('/courseId=:courseId/:ClassId/addattendance', (req, res) => {
    let date = new Date()
    async function createAttendance(idCourse, idClass, data) {
        const course = await Course.findOne({ _id: idCourse,  })
        if (!course) throw new MyError('Course not found', 404);

        const coursee = await Course.findOne({_id: idClass})
        if (!coursee) throw new MyError('Coursee not found', 404);

        
        const newAttendance = {
            UserId: data.UserId,
            Date: data.Date
        }
        // add room to array
        coursee.Attendance.unshift(newAttendance);
        course.save();
        return newAttendance;
    }
    const { errors, isValid } = validateAttendanceInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    createAttendance(req.params.courseId,req.params.ClassId, req.body)
        .then(Attendance => res.send({
            resultCode: 1,
            message: 'Tạo mới thành công',
            data: Attendance
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data: 0
        }));
});
router.post('/checkin', async (req, res) => {
    let userId = '5dcb830a9c6c601284e073ad'
    let Ssid = req.header('Ssid')
    let date = new Date()
    let Wifi = req.header('Wifi')
    let today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    try {
        const checkWifi = await Building.findOne(
            {
                'Rooms.Ssid': Ssid,
                'Rooms.Wifi': Wifi
            }
        )
        if(checkWifi === null){
            return res.json({
                resultCode: -1,
                message: 'Bạn không thể checkin với kết nối wifi này',
                data: null
            })
        }
        for (const ip of 'checkWifi.Rooms.Wifi') {
            if (ip === Wifi) {
                location = `${Ssid}`
            }
        }
        const Check_in = await Course.findOne({
            'Class.Attendance.UserId' : userId,
        })
        if(Check_in.Class.filter(Attendance.filter(att => att.UserId.toString() === userId.toString()) != null)){
            return res.json({
                resultCode: -1,
                message: 'Bạn đã checkin trong ngày hôm nay',
                data: {
                  Check_inTime: Check_in.Class.Attendance.Check_in.time
                }
            })
        }
        await Course.findOneAndUpdate(
            {
                'Attendance.Userid' : userId,
            },
            {
                'Attendance.Check_in' : {
                    time: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                }
            }
        )
        const check = await Course.findOne({
            UserId : userId
        })
        if (check !== null){
            return res.json({
                resultCode: 1,
                message: 'Thành công',
                data: {
                  checkinTime: check.Class.Attendance.Check_in.time
                }
              })
        } else {
            return res.json({
              resultCode: -1,
              message: 'Thất bại',
              data: null,
            })
    }
} catch (error){
    console.log(error)
    return res.json({
      resultCode: -1,
      message: 'Thất bại',
      data: null,
      error: error
    })
}});
router.delete('/courseId=:courseId/:classId', (req, res) => {
    async function deleteClass(idCourse, idClass) {
        const course = await Course.findOne({ _id: idCourse });
        if (!course) throw new MyError('Course not found', 404);
        // get remove index
        const removeIndex = course.Class
            .map(item => item.id)
            .indexOf(idClass);
        //splice out of array
        course.Class.splice(removeIndex, 1);
        //save 
        course.save();
        return course;
    }
    deleteClass(req.params.courseId, req.params.classId)
        .then(Class => res.send({
            resultCode: 1,
            message: 'Xóa thành công',
            data: Class
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data: 0
        }));
});
router.delete('/courseId=:courseId/:commentId', (req, res) => {
    async function deleteComment(idCourse, idComment) {
        const course = await Course.findOne({ _id: idCourse });
        if (!course) throw new MyError('Course not found', 404);
        // get remove index
        const removeIndex = course.Comment
            .map(item => item.id)
            .indexOf(idClass);
        //splice out of array
        course.Comment.splice(removeIndex, 1);
        //save 
        course.save();
        return course;
    }
    deleteComment(req.params.courseId, req.params.commentId)
        .then(Comment => res.send({
            resultCode: 1,
            message: 'Xóa thành công',
            data: Comment
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data: 0
        }));
});
router.delete('/courseId=:courseId/:attendanceId', (req, res) => {
    async function deleteAttendance(idCourse, idAttendance) {
        const course = await Course.findOne({ _id: idCourse });
        if (!course) throw new MyError('Course not found', 404);
        // get remove index
        const removeIndex = course.Attendance
            .map(item => item.id)
            .indexOf(idAttendance);
        //splice out of array
        course.Attendance.splice(removeIndex, 1);
        //save 
        course.save();
        return course;
    }
    deleteAttendance(req.params.courseId, req.params.attendanceId)
        .then(Attendance => res.send({
            resultCode: 1,
            message: 'Xóa thành công',
            data: Attendance
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data: 0
        }));
});
router.delete('/courseId=:courseId', (req, res) => {
    Course.findByIdAndDelete(req.params.courseId)
        .then(Course => res.json({
            resultCode: 1,
            message: 'Xóa thành công',
            data: Course
        }
        ))
        .catch(err => res.json({
            resultCode: -1,
            message: 'Xóa không thành công',
            data: 0
        }));
})


router.get('/getStudentListByClass', async (req, res) => {
    let queryParams = req.query
    let classId = queryParams.classId

    try {
        const course = await Course.findOne({
            'Class._id': classId
        })
        let classs = course.Class.filter(data => data._id.toString() === classId.toString())
        let attendance = classs[0].Attendance

        getFullName = async (_id) => {
            const account = await Account.findOne({
                _id: _id
            })
            return account.fullName
        }

        let result = []

        for (const student of attendance) {
            result.push({
                fullName: await getFullName(student.UserId),
                checkinTime: student.Check_in,
                checkoutTime: student.Check_out
            })
        }

        res.json({
            resultCode: 1,
            message: 'Thành công',
            data: result
        })

    } catch (error) {
        console.log(error)
        res.json({
            resultCode: -1,
            message: 'Thất bại',
            data: null,
            error: error
        })
    }
})

router.get('/downloadStudentList', async (req, res) => {
    let queryParams = req.query
    let classId = queryParams.classId

})

router.get('/getClassByUser', async (req, res) => {
    let userId = req.header('userId')
    let result = []


    getBuildingName = async (id) => {
        const building = await Building.findOne(
            { '_id': id }
        )
        return building.Name
    }

    getRoomName = async (id) => {
        const building = await Building.findOne(
            { 'Rooms._id': { $eq: id } }
        )
        let room = building.Rooms.filter(room => room._id.toString() === id.toString())
        return room[0].Name
    }

    getWifiName = async (roomId) => {
        const building = await Building.findOne(
            { 'Rooms._id': roomId }
        )
        let room = building.Rooms.filter(room => room._id.toString() === roomId.toString())
        return room[0].Ssid
    }

    try {
        const courses = await Course.find({
            'Class.0.Attendance.UserId': userId
        })
        for (const course of courses) {
            for (const classs of course.Class) {
                result.push({
                    courseId: course._id,
                    courseName: course.Name,
                    classId: classs._id,
                    className: classs.Name,
                    trainer: classs.Trainer,
                    date: classs.Date,
                    startedTime: classs.From_hours,
                    endedTime: classs.To_hours,
                    building: await getBuildingName(classs.Building_ID),
                    room: await getRoomName(classs.Room_ID),
                    wifi: await getWifiName(classs.Room_ID)
                })
            }
        }

        res.json({
            resultCode: 1,
            message: 'Thành công',
            data: result
        })
    } catch (error) {
        console.log(error)
        res.json({
            resultCode: -1,
            message: 'Thất bại',
            data: null,
            error: error
        })
    }
})

router.post('/sendClassCode', async (req, res) => {
    let classCode = req.body.classCode
    let classId = req.body.classId

    try {
        const course = await Course.findOne({
            'Class._id': classId
        })
        let classs = course.Class.filter(data => data._id.toString() === classId.toString())
        let code = classs[0].Code

        if (classCode.toString() === code.toString()) {
            res.json({
                resultCode: 1,
                message: 'Thành công',
                data: null
            })
        } else {
            res.json({
                resultCode: -1,
                message: 'Mã điểm danh sai',
                data: null,
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            resultCode: -1,
            message: 'Thất bại',
            data: null,
            error: error
        })
    }

})

module.exports = router;

