const express = require('express')
const User = require('../src/models/user')  
const auth = require('../src/middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const sendWelcomeEmail = require('../src/emails/account')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image'))
        }
        cb(undefined, true)
    }
})

router.post('/User', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/User/me', auth, async (req, res) => {
    res.send(req.user)
})


router.post('/User/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/User/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/User/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/User/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.status(200).send(user)

    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/User/me', auth, async (req, res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isAllowed = updates.every(update => allowedUpdates.includes(update))

    if (!isAllowed) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        
        const user = await User.findByIdAndUpdate(req.user._id)
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/User/me', auth, async (req, res) => {
    try {
        await req.user.remove() // or const user = await User.findByIdAndDelete(req.user._id)
        sendWelcomeEmail(req.user.email, req.user.name, true)
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/User/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, size: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(404).send({error: error.message})
})

router.get('/User/:id/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

router.delete('/User/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

module.exports = router