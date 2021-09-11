const express = require('express')
const task = require('../src/models/task')
const auth = require('../src/middleware/auth')

const router = new express.Router()

router.post('/Task', auth, async (req, res) => {
    const newTask = new task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await newTask.save()
        res.send(newTask)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/Task', auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        match.owner = req.user._id
        match.completed = req.query.completed === 'true'
    } else {
        match.owner = req.user._id
    }

    const sort = {}
    const str = req.query.sortBy
    if (str.length > 0) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const user = await task.find(match).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/Task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const mytask = await task.findOne({ _id, owner: req.user._id })
        if (!mytask) {
            return res.status(404).send()
        }
        res.send(mytask)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/Task/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const toUpdate = ['description', 'completed']

    const isValid = updates.every(update => toUpdate.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid update!' })
    }


    try {
        const mytask = await task.findOne({ _id: req.params.id, owner: req.user._id }) 
        if (!mytask) {
            return res.status(400).send()
        }
        updates.forEach(update => mytask[update] = req.body[update])
        await mytask.save()
        res.send(mytask)    
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/Task/:id', auth, async (req, res) => {
    try {
        const user = await task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router