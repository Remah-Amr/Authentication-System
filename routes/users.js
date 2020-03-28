const express = require('express')
const router = require('express-promise-router')()
const userControllers = require('../contorllers/users')
const passport = require('passport')
// const passportConf = require('../passport')
require('../passport')

router.post('/signup',userControllers.signup)

router.post('/signin',passport.authenticate('local',{ session:false }),userControllers.singin)

router.get('/secret',passport.authenticate('jwt',{ session:false }),userControllers.secret)

router.post('/oauth/google',passport.authenticate('googleToken',{session : false}),userControllers.googleOauth)

module.exports = router


// 848821189810-gotr531nutova0mhrlsmd8gt9q14s3ph.apps.googleusercontent.com
// hY0fzKsbncZa0g0pqjTNZp_F