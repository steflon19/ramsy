const http = require('http')
const fs = require('fs');

const port = process.env.PORT || 8040

const status = response => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
};

const json = response => response.json();

const server = http.createServer((req, res) => {
    const urlParsed = new URL(req.url, 'http://' + req.headers.host)
    const path = urlParsed.pathname
    const params = urlParsed.searchParams
    if (req.method === 'GET') {
        if (path === '/') {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end('homepage')
        } else if (path === '/hello') {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end('<h1>Hello, World!</h1>')
        } else if (path === '/ping') {
            /** 2. Create an endpoint “GET /ping” that returns “pong!”. This is the health-check */
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end('pong!')
        } else if (path === '/version') {
            /** 3. Create an endpoint “GET /version” that returns the Node version in use. */
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(process.version)
        } else if (path === '/images') {
            /** 4. Create an endpoint “GET /images” that fetches and returns the data from this other endpoint: 
             * 4.1. Create a query parameter “?size=<number>” that lets a user specify how many objects
                will be returned.
             * 4.2. Create a query parameter “?offset=<number>” that lets a user select an offset of the
                previous size (i.e. “?size=2&offset=5” would show images 11 and 12). By default, the
                offset is 0. (tip: think pagination)
            */
            const testPhotoUrl = 'https://jsonplaceholder.typicode.com/photos'
            const size = parseInt(params.get('size'))
            const offset = parseInt(params.get('offset')) || 0

            fetch(testPhotoUrl).then(status).then(json)
                .then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    const returnData = JSON.stringify(data.filter(d => d.id >= offset && (size ? d.id < (offset + size) : true)))
                    res.write(returnData)
                    res.end()
                })
                // TODO: proper error handling
                .catch(badstuff => console.error('bad stuff hapened', badstuff))

        } else if (path === '/Nicholas') {
            /** 5. Create an endpoint “GET /Nicholas” where you return an aggregation of the data for userId 8
                along with all his posts, wrapping them in “user” and “posts” respectively.
                You get this data from https://jsonplaceholder.typicode.com/users and
                https://jsonplaceholder.typicode.com/posts
            */
            const usersUrl = 'https://jsonplaceholder.typicode.com/users'
            const postsUrl = 'https://jsonplaceholder.typicode.com/posts'

            const usersPromise = fetch(usersUrl).then(status).then(json)
            const postsPromise = fetch(postsUrl).then(status).then(json)

            Promise.all([usersPromise, postsPromise]).then(data => {
                const users = data[0].find(d => d.id === 8)
                const posts = data[1].filter(d => d.userId === 8)
                const aggregatedData = JSON.stringify({ 'users': users, 'posts': posts })
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.write(aggregatedData)
                res.end()
            })
                // TODO: proper error handling
                .catch(e => console.error('error', e))
        } else if (path === '/Romaguera') {
            /** 6. Create an endpoint “GET /Romaguera” where you return all the posts created by users that work
                for Romaguera group (tip: there’s more than one company in the group).
            */
            const usersUrl = 'https://jsonplaceholder.typicode.com/users'
            const postsUrl = 'https://jsonplaceholder.typicode.com/posts'

            const usersPromise = fetch(usersUrl).then(status).then(json)
            const postsPromise = fetch(postsUrl).then(status).then(json)
            Promise.all([usersPromise, postsPromise]).then(data => {
                const users = data[0].filter(d => d.company?.name?.indexOf('Romaguera') >= 0).map(d => d.id)
                const posts = data[1].filter(d => users.includes(d.userId))
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.write(JSON.stringify(posts))
                res.end()
            })
                // TODO: proper error handling
                .catch(e => console.error('error', e))
        } else if (path === '/sorted-users') {
            /** 8. Create an endpoint “GET /sorted-users” where you return the users on
                https://jsonplaceholder.typicode.com/users sorted alphabetically by their cities, removing those
                which their websites domains are not “.com”, “.net” or “.org”
            */

            const usersUrl = 'https://jsonplaceholder.typicode.com/users'
            const allowedDomains = ['com', 'net', 'org']
            fetch(usersUrl).then(status).then(json).then(data => {
                data = data.filter(d =>
                    allowedDomains.includes(d.website.split('.').pop())
                ).sort((a, b) => a.address.city.localeCompare(b.address.city))
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            })
        } else {
            /** 9. Return a graceful 404 message when trying to access your API outside the previously described
                endpoints */
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html')
            fs.readFile("src/pages/404.html", function (error, pgResp) {
                if (error) {
                    res.end('<h2>Boring 404, you should go home and try again</h2>');
                } else {
                    res.end(pgResp);
                }
            });
        }
    } else if (req.method === 'POST') {
        if (path === '/') {
            /** 7. Create an endpoint “POST / ” that creates a new TODO. You will receive JSON from the client
                and you will forward it to the API https://jsonplaceholder.typicode.com/todos in UTF-8 format
                with the following body:
                {
                “userId”: <number>,
                “title”: <string>,
                “completed”: <boolean>
                }
            */
            const todosUrl = 'https://jsonplaceholder.typicode.com/todos'
            const todo = {
                userId: 19,
                title: 'finish interview assignments',
                completed: true
            }
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            }
            fetch(todosUrl, options).then(status).then(json).then(data => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            }).catch(e => console.error("error ", e))
        }
    }
})

/** 1. Create a concurrent HTTP server that listens on port 8040. */
server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
