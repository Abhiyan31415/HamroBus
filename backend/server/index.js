const express=require('express');
const mongoose=require('mongoose');
const path=require('path'); 
const bcrypt=require('bcrypt');
const app=express();
const home=require
app.get('/',(req,res)=>{
    res.render();
});
app.get('/login',(req,res)=>{
    res.render('Login');
});

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
});