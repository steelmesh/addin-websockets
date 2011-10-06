var fs = require('fs'),
    path = require('path'),
    clientScript;

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

function provideSocketScript(req, res, next) {
    res.contentType('assets/sockets.js');
    
    if (clientScript) {
        res.send(clientScript);
    }
    else {
        fs.readFile(path.resolve(__dirname, 'assets/sockets.js'), 'utf8', function(err, data) {
            if (! err) {
                clientScript = data;
                res.send(clientScript);
            } // if
        });
    } // if..else
}

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
    
    instance.get('/sockets.js', provideSocketScript);
};