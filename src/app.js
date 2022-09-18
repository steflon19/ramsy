const http = require('http')
const fs = require('fs');

const { URLS, DEFAULT_PORT, HTTP_ROOT, REQUESTS } = require('./common/constants.js');
const { filterAllowedDomains, sortByCity, status, json, filterRomaguera, filterImages } = require('./utils/utils.js');
const { ROUTES } = require('./common/routes.js');

const port = process.env.PORT || DEFAULT_PORT

const server = http.createServer((req, res) => {
    const urlParsed = new URL(req.url, HTTP_ROOT + req.headers.host)
    const path = urlParsed.pathname
    const params = urlParsed.searchParams
    if (req.method === REQUESTS.GET) {
        if (path === ROUTES.home) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end('<h2>Homepage</h2>')
        } else if (path === '/ping') {
            /** 2. Create an endpoint “GET /ping” that returns “pong!”. This is the health-check */
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end('pong!')
        } else if (path === ROUTES.version) {
            /** 3. Create an endpoint “GET /version” that returns the Node version in use. */
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(process.version)
        } else if (path === ROUTES.images) {
            /** 4. Create an endpoint “GET /images” that fetches and returns the data from this other endpoint: 
             * 4.1. Create a query parameter “?size=<number>” that lets a user specify how many objects
                will be returned.
             * 4.2. Create a query parameter “?offset=<number>” that lets a user select an offset of the
                previous size (i.e. “?size=2&offset=5” would show images 11 and 12). By default, the
                offset is 0. (tip: think pagination)
            */
            const size = parseInt(params.get('size'))
            const offset = parseInt(params.get('offset')) || 0

            fetch(URLS.photosUrl).then(status).then(json)
                .then(data => {
                    // If no size specified return all elements.
                    const elements = size || (data.length - offset)
                    const returnData = JSON.stringify(data.filter(d => filterImages(d, elements, offset)))

                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.write(returnData)
                    res.end()
                })
                .catch(e => console.error('an error occured:', e))

        } else if (path === ROUTES.nicholas) {
            /** 5. Create an endpoint “GET /Nicholas” where you return an aggregation of the data for userId 8
                along with all his posts, wrapping them in “user” and “posts” respectively.
                You get this data from https://jsonplaceholder.typicode.com/users and
                https://jsonplaceholder.typicode.com/posts
            */

            const usersPromise = fetch(URLS.usersUrl).then(status).then(json)
            const postsPromise = fetch(URLS.postsUrl).then(status).then(json)

            Promise.all([usersPromise, postsPromise]).then(data => {
                const users = data[0].find(d => d.id === 8)
                const posts = data[1].filter(d => d.userId === 8)
                const aggregatedData = JSON.stringify({ 'users': users, 'posts': posts })
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.write(aggregatedData)
                res.end()
            })
                .catch(e => console.error('an error occured:', e))
        } else if (path === ROUTES.romaguera) {
            /** 6. Create an endpoint “GET /Romaguera” where you return all the posts created by users that work
                for Romaguera group (tip: there’s more than one company in the group).
            */

            const usersPromise = fetch(URLS.usersUrl).then(status).then(json)
            const postsPromise = fetch(URLS.postsUrl).then(status).then(json)
            Promise.all([usersPromise, postsPromise]).then(data => {
                const users = data[0].filter(filterRomaguera).map(d => d.id)
                const posts = data[1].filter(d => users.includes(d.userId))
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.write(JSON.stringify(posts))
                res.end()
            })
                // TODO: proper error handling
                .catch(e => console.error('error', e))
        } else if (path == ROUTES.sortedUsers) {
            /** 8. Create an endpoint “GET /sorted-users” where you return the users on
                https://jsonplaceholder.typicode.com/users sorted alphabetically by their cities, removing those
                which their websites domains are not “.com”, “.net” or “.org”
            */

            fetch(URLS.usersUrl).then(status).then(json).then(data => {
                data = data.filter(filterAllowedDomains).sort(sortByCity)
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
                    res.end('<h2>Seems like we couldn\'t find what you are looking for, you should go < a href = "/" > home</a > and try again</h2 > ');
                } else {
                    res.end(pgResp);
                }
            });
        }
    } else if (req.method === REQUESTS.POST) {
        if (path === ROUTES.home) {
            /** 7. Create an endpoint “POST / ” that creates a new TODO. You will receive JSON from the client
                and you will forward it to the API https://jsonplaceholder.typicode.com/todos in UTF-8 format
                with the following body:
                {
                “userId”: <number>,
                “title”: <string>,
                “completed”: <boolean>
                }
            */
            let todo = ''
            // Read data on stream
            req.on('data', chunk => {
                todo += chunk.toString(); // convert Buffer to string
            })
            // Process request data on finish
            req.on('end', () => {
                const options = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: todo
                }
                fetch(URLS.todosUrl, options).then(status).then(json).then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(data))
                }).catch(e => console.error("error ", e))
            });
        }
    }
})

/** 1. Create a concurrent HTTP server that listens on port 8040. */
server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
