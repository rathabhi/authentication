//jshint esversion:6
require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/loginPortalDB",{useNewUrlParser:true});

const loginSchema=new mongoose.Schema({
    email:String,
    password:String
});

loginSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User= new mongoose.model("User",loginSchema);



app.get("/",function(req,res){
    res.render("home");
});
app.get("/register",function(req,res){
    res.render("register");

});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/register",function(req,res){
    const user=new User({
        email:req.body.username,
        password:req.body.password
    });
    user.save(function(err){
        if(err)
        console.log(err);
        else
        res.render("secrets");
    });
});
app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,found){
        if(err)
        console.log(err);
        else
        {
            if(found){
                if(found.password===req.body.password)
                res.render("secrets");
            }
        }
    });
});



app.listen(3000,function(){
    console.log("server is listening");
})