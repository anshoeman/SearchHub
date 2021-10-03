const express = require('express');
const router = express.Router()
const {ensureAuth,forwardAuth} = require('../config/auth')

router.get('/dashboard',ensureAuth,(req,res)=>{
    res.render('dashboard',{
        name:req.user.name
    });
})


router.get('/',forwardAuth,(req,res)=>{
    res.render('index')
})


module.exports = router