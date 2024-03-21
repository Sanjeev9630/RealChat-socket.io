const express = require('express')
const path = require('path');
const { Socket } = require('socket.io');
const app = express();
const PORT = process.env.PORT || 4000
const sever = app.listen(PORT, () => console.log(`Server running on ${PORT}`))

const io = require('socket.io')(sever)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConnected = new Set()

io.on('connection', onConnected )

function onConnected(socket) {
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)        // to emit/send event from server side to client side
    
    socket.on('disconnect', () => {
        console.log('Socket Disconnected', socket.id)
        socketsConnected.delete(socket.id)

        io.emit('client-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}
