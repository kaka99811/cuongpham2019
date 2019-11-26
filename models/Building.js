const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({       
            Name : {
                type : String
            },
            Wifi : {
                type : String
            }    
})
const buildingSchema = new Schema({
    Name : {
        type : String
    },
    Rooms: [
        roomSchema
    ]
});
module.exports = Building = mongoose.model('Building' , buildingSchema);