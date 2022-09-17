const http = require('http')

const port = process.env.PORT || 8040

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (url === '/') {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end('homepage')
        }
    }
})

/** 1. Create a concurrent HTTP server that listens on port 8040. */
server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
