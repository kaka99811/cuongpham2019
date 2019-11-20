const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Building = require('../../models/Building');
const Course = require('../../models/Course');

const{ MyError } = require('../../utils/myError');

const validateAttendanceInput = require('../../validation/attendance');
const validateClassInput = require('../../validation/class');
const validateCommentInput = require('../../validation/comment');
const validateCourseInput = require('../../validation/course');

router.get('/' , (req,res) => {
    Course.find()
    .sort({_id : -1})
    .then(courses => res.json({
        resultCode: 1,
        message: 'lay du lieu thanh cong',
        data: courses
    }))
    .catch(err => res.json({
        resultCode: -1,
        message: 'lay du lieu khong thanh cong',
        data: 0
    }))
});
router.get('/class/:courseId' , (req,res) => {
    async function getClass(idCourse){
        if (!idCourse) {
            throw new MyError('Sai id', 400);
        }
        const {Class} = await Course.findById(idCourse, {Class : 1});
        return {Class};
    }
    getClass(req.params.courseId)
    .then(Class => res.json({
        resultCode: 1,
        message: ' thành công ',
        data: Class
    }))
    .catch(err => res.json({
        resultCode: -1,
        message: ' k thành công ',
        data: 0
    }))
    
});
router.post('/create', (req,res) => {
    const{errors , isValid} = validateCourseInput(req.body);
    //kiem tra va bao loi
    if(!isValid){
        return res.status(400).json(errors)
    }
    const courseFields = {};
    if(req.body.Name) courseFields.Name = req.body.Name
    if(req.body.Trainer) courseFields.Trainer = req.body.Trainner
    if(req.body.FromDate) courseFields.FromDate = req.body.FromDate
    if(req.body.ToDate) courseFields.ToDate = req.body.ToDate
    if(req.body.Room_ID) courseFields.Room_ID = req.body.Room_ID

    Course.findOne({Name : req.body.Name})
        .then(course => {
            if(course) {
                // báo lỗi đã tồn tại
                return res.json({
                    resultCode: -1,
                    message:'Tên khóa học đã được sử dụng',
                    data:0
                });
            } else {
                // create
                // lưu khóa học vừa tạo
                new Course(courseFields).save().then(course => res.json({
                    resultCode: 1,
                    message:'Tạo mới khóa học thành công',
                    data: course
                }));
            }
        });

});
router.post('/:courseId' , (req,res) => {
    const {errors, isValid} = validateCourseInput(req.body);
    // kiểm tra và báo lỗi
    if(!isValid){
        return res.status(400).json(errors)
    }
    const courseFields = {};
    if(req.body.Name) courseFields.Name = req.body.Name;
    if(req.body.Trainer) courseFields.Trainer = req.body.Trainer
    if(req.body.FromDate) courseFields.FromDate = req.body.FromDate
    if(req.body.ToDate) courseFields.ToDate = req.body.ToDate
    if(req.body.Room_ID) courseFields.Room_ID = req.body.Room_ID
    Course.findOne({_id : req.params.courseId})
        .then(course => {
            if(!course){
                // báo lỗi không tồn tại
                return res.status(400).json({
                    resultCode: -1,
                    message: 'Không tìm thấy khóa học này',
                    data: 0
                });
            } else {
                Course.findByIdAndUpdate({_id : req.params.courseId}, {$set: courseFields}, {new:true})
                .then(course => res.json({
                    resultCode: 1,
                    message:'Trùng tên',
                    data: 0
                }));
            }
        });        
});
router.post('/:courseId/addclass' , (req,res) => {
    async function createClass(idCourse, data){
        const course = await Course.findOne({_id: idCourse});
        if(!course) throw new MyError('Course not found', 404);
        const newClass = {
            Name : data.Name,
            Trainer : data.Trainer,
            Date : data.Date,
            From_hours : data.From_hours,
            To_hours : data.To_hours,
            Room_ID : data.Room_ID,
            Code : data.Code,
        }
        // add room to array
        course.Class.unshift(newClass);
        course.save();
        return newClass;
    }
    const{errors, isValid} = validateClassInput(req.body);
    if(!isValid) return res.status(400).json(errors);

    createClass(req.params.courseId, req.body)
        .then(Class => res.send({
            resultCode: 1,
            message:'Tạo mới thành công',
            data: Class
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data:0
        }));
});
router.post('/:courseId/addcomment' , (req,res) => {
    async function createComment(idCourse, data){
        const course = await Course.findOne({_id: idCourse});
        if(!course) throw new MyError('Course not found', 404);
        const newComment = {
            Username : data.Username,
            Question_1 : data.Question_1,
            Question_2 : data.Question_2,
            Question_3 : data.Question_3,
            Question_4 : data.Question_4,
            Question_5_1 : data.Question_5_1,
            Question_5_2 : data.Question_5_2,
            Question_5_3 : data.Question_5_3,
            Question_5_4 : data.Question_5_4,
            Question_5_5 : data.Question_5_5,
            Question_5_6 : data.Question_5_6,
            Question_5_7 : data.Question_5_7
        }
        // add room to array
        course.Comment.unshift(newComment);
        course.save();
        return newComment;
    }
    const{errors, isValid} = validateCommentInput(req.body);
    if(!isValid) return res.status(400).json(errors);

    createComment(req.params.courseId, req.body)
        .then(Comment => res.send({
            resultCode: 1,
            message:'Tạo mới thành công',
            data: Comment
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data : 0
        }));
});
router.post('/:courseId/addattendance' , (req,res) => {
    async function createAttendance(idCourse, data){
        const course = await Course.findOne({_id: idCourse});
        if(!course) throw new MyError('Course not found', 404);
        const newAttendance = {
            Username : data.Username,
            Check_in : data.Check_in,
            Check_out : data.Check_out,
            Date : data.Date,
            Class_ID : data.Class_ID
        }
        // add room to array
        course.Attendance.unshift(newAttendance);
        course.save();
        return newAttendance;
    }
    const{errors, isValid} = validateAttendanceInput(req.body);
    if(!isValid) return res.status(400).json(errors);

    createAttendance(req.params.courseId, req.body)
        .then(Attendance => res.send({
            resultCode: 1,
            message: 'Tạo mới thành công',
            data : Attendance
        }))
        .catch(err => res.json({
            resultCode: -1,
            message: err.message,
            data: 0
        }));
});
router.delete('/:courseId/:classId' , (req,res) => {
    async function deleteClass(idCourse, idClass){
        const course = await Course.findOne({_id : idCourse});
        if(!course) throw new MyError('Course not found', 404);
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
router.delete('/:courseId/:commentId' , (req,res) => {
    async function deleteComment(idCourse, idComment){
        const course = await Course.findOne({_id : idCourse});
        if(!course) throw new MyError('Course not found', 404);
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
        message:'Xóa thành công',
        data: Comment
    }))
    .catch(err => res.json({
        resultCode: -1,
        message: err.message,
        data: 0
    }));
});
router.delete('/:courseId/:attendanceId' , (req,res) => {
    async function deleteAttendance(idCourse, idAttendance){
        const course = await Course.findOne({_id : idCourse});
        if(!course) throw new MyError('Course not found', 404);
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
        message:'Xóa thành công',
        data: Attendance
    }))
    .catch(err => res.json({
        resultCode: -1,
        message: err.message,
        data:0
    }));
});
router.delete('/:courseId', (req,res) => {
    Course.findByIdAndDelete(req.params.courseId)
    .then(Course => res.json({
        resultCode : 1,
        message:'Xóa thành công',
        data: Course
        }
    ))
    .catch(err => res.json({
        resultCode: -1,
        message: 'Xóa không thành công',
        data: 0
    }));
})
module.exports = router;

