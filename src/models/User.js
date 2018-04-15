import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const schema = new mongoose.Schema({
  email:{type:String,required:true,lowercase:true,index:true},
  passwordHash:{type:String,required:true}
},
{timestamp:true}
);

schema.methods.isValidPassword = function isValidPassword(password){
  return bcrypt.compareSync(password,this.passwordHash);
};

schema.methods.generateJWT = function generateJWT(){
  return jwt.sign({
    email:this.email,
  },process.env.JWT_SECRET)
};
schema.methods.toAuthJSON = function toAuthJSON(){
  return {
    email:this.email,
    token:this.generateJWT()
  }
};


export default mongoose.model('user',schema);
