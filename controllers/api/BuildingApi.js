const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Building = require('../../models/Building');
const Course = require('../../models/Course');

const{ MyError } = require('../../utils/myError');

const validateBuildingInput = require('../../validation/building');
const validateRoomInput = require ('../../validation/room');

router.get('/' , (req,res) => {
    Building.find()
        .sort({_id : -1})
        .then(buildings => res.json({
            resultcode: 1,
            message: 'lay du lieu thanh cong',
            data: buildings
        }))
        .catch(err => res.json({
            resultcode: -1,
            message: 'lay du lieu khong thanh cong',
            data: 0
        }))
});

router.post('/create', (req,res) => {
    const {errors , isValid} = validateBuildingInput(req.body);
    //kiem tra va bao loi
    if(!isValid){
        return res.json(errors)
    }
    const buildingFields = {};
    if(req.body.Name) buildingFields.Name = req.body.Name

    Building.findOne({Name : req.body.Name})
        .then(building => {
            if(building) {
                //báo lỗi đã tồn tại
                return res.json({
                    resultcode: -1,
                    message: 'Tên tòa nhà này đã được sử dụng',
                    data: 0
                });
            } else {
                // create 
                // lưu buildig vừa tạo
                new Building(buildingFields).save().then(building => res.json({
                    resultcode: 1,
                    message: ' Tạo mới tòa nhà thành công',
                    data: building
                }));
            }
        });
});
router.post('/:buildingId' , (req,res) => {
    const {errors, isValid} = validateBuildingInput(req.body);
    // kiểm tra và báo lỗi
    if(!isValid){
        return res.status(400).json(errors)
    }
    const buildingFields = {};
    if(req.body.Name) buildingFields.Name = req.body.Name;

    Building.findOne({_id : req.params.buildingId})
        .then(building => {
            if(!building){
                //báo lỗi không tồn tại
                return res.json({
                    resultcode: -1,
                    message: 'Không tìm thấy tòa nhà này',
                    data: 0
                });
            } else {
                Building.findByIdAndUpdate({ _id : req.params.buildingId}, { $set: buildingFields} , {new: true})
                .then(building => res.json({
                    resultcode: 1,
                    message: 'Trùng tên',
                    data: 0
                }));
            }
        });
});
router.post('/buildingId=:buildingId/addroom' , (req,res) => {
    async function createRoom(idBuilding, data){
        const building = await Building.findOne({_id: idBuilding});
        if(!building) throw new MyError('Building not found', 404);
        const newRoom = {
            Name : data.Name,
            Wifi : data.Wifi,
        }
        // add room to array
        building.Rooms.unshift(newRoom);
        building.save();
        return newRoom;
    }
    const{errors, isValid} = validateRoomInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    createRoom(req.params.buildingId, req.body)
        .then(room => res.send({
            resultcode: 1,
            message:'Tạo mới thành công',
            data: room
        }))
        .catch(err => res.json({
            resultcode: -1,
            message: err.message,
            data: 0
        }));
});
router.delete('/buildingId=:buildingId/:roomId', (req,res) => {
    async function deleteRoom(idBuilding, idRoom){
        const building = await Building.findOne({_id: idBuilding});
        if(!building) throw new MyError('Building not found' , 404);
        // get remove index
        const removeIndex = building.Rooms
            .map(item => item.id)
            .indexOf(idRoom);
        //splice out of array
        building.Rooms.splice(removeIndex, 1);
        //save 
        building.save();
        return building;
    }
    deleteRoom(req.params.buildingId, req.params.roomId)
        .then(room => res.send({
            resultcode: 1,
            message:'Xóa thành công',
            data: room
        }))
        .catch(err => res.json({
            resultcode: -1,
            message: err.message,
            data: 0
        }));
});

module.exports = router;