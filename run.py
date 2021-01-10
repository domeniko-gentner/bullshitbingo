# -*- coding: utf-8 -*-
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from sys import argv

port = 80
host = "localhost"

if len(argv) >= 2:
    host = argv[1]

if len(argv) >= 3:
	port = int(argv[2])



handler = SimpleHTTPRequestHandler
handler.extensions_map = {
	'.manifest': 'text/cache-manifest',
	'.html': 'text/html',
	'.png': 'image/png',
	'.jpg': 'image/jpg',
	'.svg':	'image/svg+xml',
	'.css':	'text/css',
	'.js':	'application/x-javascript',
	'.wasm': 'application/wasm',
	'': 'application/octet-stream'
}

try:
	httpd = TCPServer((host, port), handler)
	print(f"serving at port {port}")
	httpd.serve_forever()
except KeyboardInterrupt:
	print("Server stopped, good bye!")