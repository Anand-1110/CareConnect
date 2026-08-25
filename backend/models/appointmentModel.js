import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
        userId: {type:String, required:true},
        docId: {type:String, required: true},
        slotDate: {type:String, required: true },
})