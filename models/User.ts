import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    supabaseId : {
         type : String,
         required : true ,
         unique:true
        },
    name :{
         type : String ,
         default : 'Coder' 
    },
    email : { 
        type: String ,
        required : true
    },
    avatar : {
        type : String,
        default : '',
    },
    bio :{
        type : String , default : ''
    },
    twitterUrl :{
        type : String,
        default : ''
    },
    linkedinUrl :{
        type : String,
        default : ''  
    },
    isPro: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    mentorPrefs: {
        goal: { type: String, default: 'I want to balance everything' },
        focus: { type: String, default: '' },
        strictness: { type: String, default: 'Normal' }
    },
    isDeleted: { type: Boolean, default: false }
},{timestamps : true});

export const User = mongoose.models.User || mongoose.model('User' , UserSchema);