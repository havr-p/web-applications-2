const express = require('express');
const app = express ();
const server = require('http').createServer (app);
const io = require('socket.io')(server);

app.use('/', express.static('www'));

server.listen (9000, () => {
  console.log ('Listen on port 9000');
});




let DB = [];


io.on ('connect', socket => {
  console.log ('Nový klient pripojený.');

  socket.on ('disconnect', msg => {
    console.log ('Klient odpojený.', msg);
  });


socket.on('insert', ({name = '', surname = ''}) => {
  console.log(name, surname);
  if (name.length > 0 && surname.length > 0) {
    DB.push({name, surname});
    io.emit('refresh', DB);
  }
});
socket.on('select', ackFunc => {
  ackFunc(DB);
});


});



