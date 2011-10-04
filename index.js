exports.install = function(mesh, instance) {
    var io = this.io = require('socket.io').listen(instance);
    
    io.sockets.on('connection', function(socket) {
        mesh.emit('socket', socket);
        
        socket.on('event', function() {
            var emitArgs = ['event'].concat(Array.prototype.slice.call(arguments, 0)).concat('sock:' + socket.id);
            
            // send the event to other connected listeners
            // and add the client id to the end of the list so it can be distinguished on the client
            socket.broadcast.emit.apply(socket, emitArgs);
        });
    });
};