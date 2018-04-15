import express from "express";
import Users from  "../models/User";
const router = express.Router();

router.post("/", (req,res) => {
  const { credentials } = req.body;
  console.log(req.body);
  Users.findOne({email:credentials.email}).then( (user) => {
    if(user && user.isValidPassword(credentials.password)){
      res.json({user:user.toAuthJSON()});
  }else{
    res.status(400).json({errors: {global:"invalid credentials"} });
  }});
});

export default router;
