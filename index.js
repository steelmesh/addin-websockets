var fs = require('fs'),
    path = require('path'),
    clientScript,
    socketHandlers = [];

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
    var app = this;
    
    // find socket handlers
    findSocketHandlers(mesh, path.join(this.basePath, 'lib/sockets'), function(name, handler) {
        socketHandlers.push(handler);
    });
    
    mesh.on('socket', function(socket) {
        console.log('socket connected, attaching handlers: ', socketHandlers);
        
        socketHandlers.forEach(function(handler) {
            handler.call(handler, app, mesh, socket);
        });
    });
    
    instance.get('/sockets.js', provideSocketScript);
};

exports.installGlobal = function(mesh, instance) {
    mesh.socketio = require('socket.io').listen(instance);
    
    mesh.socketio.sockets.on('connection', function(socket) {
        console.log('socket connected');
        mesh.emit('socket', socket);
    });
};