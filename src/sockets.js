//= ../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io

if (typeof eve !== 'undefined') {
    var remoteServer,
        reSocketsScript = /sockets\.js$/i,
        reHost = /^(https?\:\/\/.*?)\/.*$/;
    
    //= github://DamonOehlman/eve-remote/eve-remote.js
    
    // find where this script was loaded from
    for (var ii = 0; ii < document.scripts.length; ii++) {
        var scriptSrc = document.scripts[ii].src;
        
        if (scriptSrc && reSocketsScript.test(scriptSrc)) {
            remoteServer = scriptSrc.replace(reHost, '$1');
        } // if
    } // for
    
    eve('socketio.avail', null, remoteServer);
} // if
