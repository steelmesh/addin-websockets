exports.install = function(mesh, instance) {
    this.io = require('socket.io').listen(instance);
};