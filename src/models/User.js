import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

const schema = new mongoose.Schema({
  email:{type:String,required:true,lowercase:true,index:true,unique:true},
  passwordHash:{type:String,required:true},
  confirmed:{type:Boolean, default:false}
},
{timestamp:true}
);

schema.methods.isValidPassword = function isValidPassword(password){
  return bcrypt.compareSync(password,this.passwordHash);
};

schema.methods.generateJWT = function generateJWT(){
  return jwt.sign({
    email:this.email,
  },process.env.JWT_SECRET
)};

schema.methods.setPassword = function setPassword(password){
  this.passwordHash = bcrypt.hashSync(password, 10)
};

schema.methods.toAuthJSON = function toAuthJSON(){
  return {
    email:this.email,
    confirmed:this.confirmed,
    token:this.generateJWT()
  }
};

schema.plugin(uniqueValidator, {message:'This email is already taken'})

export default mongoose.model('user',schema);
