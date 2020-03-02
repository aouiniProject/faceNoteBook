$(function () {
    let socket = io.connect('facenotebook.herokuapp.com');
    // let socket = io.connect('localhost:3001');

    socket.on('message', (data) => {

        $('#' + data.receiver).prepend('<div><h6>' + data.sender + '</h6><p>' + data.message + '</p></div>')
        $('#' + data.sender).prepend('<div><h6>' + data.sender + '</h6><p>' + data.message + '</p></div>')
    })
})