const request = require('supertest');

const serviceProject = require('../services/project');

describe('Update status project', () => {
    it('returns body', async() => {
        const response = await request(serviceProject)
        .put('/updateStatus')
        .send();
        console.log(response.text)
    })
})