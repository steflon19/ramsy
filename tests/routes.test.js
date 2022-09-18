const nock = require('nock')

test('ping', () => {
    nock('http://localhost:8040')
        .get('/ping')
        .reply(200, 'pong!')
        .isDone()
})
test('version', () => {
    nock('http://localhost:8040')
        .get('/version')
        .reply(200, "v18.8.0")
        .isDone()
})
test('404', () => {
    nock('http://localhost:8040')
        .get('/foobar')
        .reply(404)
        .isDone()
})
test('postTodos', () => {
    const testTodo = {
        "userId": 19,
        "title": "title",
        "completed": false
    }
    nock('http://localhost:8040')
        .post('/', JSON.stringify(testTodo))
        .reply(200, {
            ...testTodo,
            "id": 201
        })

})
// TODO: should include proper route tests, these dont actually evaluate server responses