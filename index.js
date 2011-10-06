var fs = require('fs'),
    path = require('path');

function findSocketHandlers(mesh, targetPath, callback) {
    // find files in the directory
    fs.readdir(targetPath, function(err, files) {
        (files || []).forEach(function(file) {
            if (path.extname(file) == '.js') {
                callback(path.basename(file, '.js'), require(path.join(targetPath, file)));
            } // if
        });
    });
} // findSocketHandlers

exports.install = function(mesh, instance) {
    var socketHandlers = [];
    
    // ensure that we have socket.io installed
    mesh.socketio = mesh.socketio || require('socket.io').listen(instance);
    
    // find socket handlers
    findSocketHandlers(mesh, path.join(mesh.targetPath, 'lib/sockets'), function(name, handler) {
        socketHandlers.push(handler);
    });

    mesh.socketio.sockets.on('connection', function(socket) {
        socketHandlers.forEach(function(handler) {
            handler.call(handler, mesh, socket);
        });
    });
};