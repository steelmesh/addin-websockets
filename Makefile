CWD=`pwd`

build:
	@interleave -o assets/sockets.js src/sockets.js
	
test:
	# node test/db.js

.PHONY: test