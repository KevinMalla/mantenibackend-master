const request = require('supertest')

const app = require('../build/index.js')

/** 
 * Testing get all tareas endpoint
*/
it('respond with json containing a list of all tareas', done => {
    request(app)
        .get('tarea')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
})