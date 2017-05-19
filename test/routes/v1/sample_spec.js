process.env.NODE_ENV = 'local-dev'
const app      = require('../../../app.js')
, request = require("supertest")
, route = '/sample';

describe("Test endpoint", () => {
    it('return success response', (done) => {
        request(app)
        .get(`${route}/FFA160317001`)
        .set('x-access-token', '')
        .send()
        .expect('Content-Type', /json/)
        .expect(401, done)
    });
});