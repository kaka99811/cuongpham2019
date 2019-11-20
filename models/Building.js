const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const buildingSchema = new Schema({
    Name : {
        type : String
    },
    Rooms: [
        {
            Name : {
                type : String
            },
            Wifi : {
                type : String
            }
        }
    ]
});
module.exports = Building = mongoose.model('Building' , buildingSchema);