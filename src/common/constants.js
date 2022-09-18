const URLS = {
    photosUrl: 'https://jsonplaceholder.typicode.com/photos',
    usersUrl: 'https://jsonplaceholder.typicode.com/users',
    postsUrl: 'https://jsonplaceholder.typicode.com/posts',
    todosUrl: 'https://jsonplaceholder.typicode.com/todos'
}

const DEFAULT_PORT = 8040
const HTTP_ROOT = 'http://'

const REQUESTS = {
    GET: 'GET',
    POST: 'POST'
}

module.exports = { URLS, DEFAULT_PORT, HTTP_ROOT, REQUESTS }