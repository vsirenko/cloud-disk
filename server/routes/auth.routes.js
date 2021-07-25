const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validateResult} = require('express-validator')
const router = new Router()

router.post('/registration',
    [
        check('email', 'uncorrect email').isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min: 3, max: 12})
    ],
    async (req, res) => {
    try {
        const errors = validateResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({message: 'Uncorrect request', errors})
        }

        const {email, password} = req.body
        const candidate = User.findOne({email})

        if(candidate) {
            return res.status(400).json({message: `User with email ${email} alredy exist`})
        }
        const hashPassword =  await bcrypt.hash(password, 15)
        const user =  new User({email, password: hashPassword})

        await user.save()
        return res.json({message: 'User was created'})
    } catch (e) {
        console.log(e)
        res.send({message: 'Server Error'})
    }
})

module.exports = router


