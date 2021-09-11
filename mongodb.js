const mongodb = require('mongodb')
const { MongoClient, ObjectId } = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log(error)
    }

    const db = client.db(databaseName)

    // db.collection('tasks').insertMany([
    //     {
    //         task: 'sex',
    //         done: false
    //     }, {
    //         task: 'masturbation',
    //         done: false
    //     }, {
    //         task: 'study',
    //         done: true  
    //     }
    // ], (err, result) => {
    //     if (error) {
    //         return console.log('unable to insert documents!')
    //     } 

    //     console.log(result.insertedIds)

    // })

    // db.collection('tasks').findOne({ _id: new ObjectId("6133b3eaac2c6cfb72ae44e9")}, (err, result) => {
    //     if(err) {
    //         return console.log('unable to find')
    //     } 
    //     console.log(result)
    // })

    // db.collection('tasks').find({ done: false }).toArray((err, result) => {
    //     console.log(result)
    // })

    // db.collection('tasks').updateMany(
    //     { done: false 
    //     }, {
    //         $set: {
    //             done: true
    //         }
    //     }   
    // ).then((done) => {
    //     console.log('Congrats!')
    // }).catch((err) => {
    //     console.log('Unable to update')
    // })

    db.collection('tasks').deleteMany(
        { task: 'masturbation' }
    ).then((done) => {
        console.log('done')
    }).catch((err) => {
        console.log('Unable to delete')
    })

})