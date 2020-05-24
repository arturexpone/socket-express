'use strict';

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('./mongodb');
const AllMessages = mongoose.AllMessages();


mongoose.connect();

const PORT = 8888;

app.get('/port', (req, res) => { res.end(`port: ${PORT}`)});

io.on('connection', socket => {

    socket.on('login', data => {
        console.log('login')
        AllMessages.create({roomId: data.roomId, userName: data.userName, message: ' '}).then(createData => {
            AllMessages.find()
                .then(arrOfData => {
                    return io.emit('set all data', arrOfData)
                }).catch(err => console.log(err))
        })
    })

    socket.on('set room', data => {
        console.log('set room')
        AllMessages.find()
            .then(arrOfData => {
                return io.emit('set all data', arrOfData)
            }).catch(err => console.log(err))
    })

    socket.on('send message', data => {
        console.log('send message')
        AllMessages.create({
            roomId: data.roomId,
            userName: data.userName,
            message: data.message,
            currentDate: data.currentDate
        }).then(createData => {
            AllMessages.find()
                .then(arrOfData => {
                    return io.emit('set all data', arrOfData)
                }).catch(err => console.log(err))
        })
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    });
});


server.listen(PORT);
