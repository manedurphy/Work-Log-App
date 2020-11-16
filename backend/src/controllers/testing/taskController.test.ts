import * as request from 'supertest';
import db from '../../models/models';
import server from '../../server/server';

describe('Task Controller', () => {
  beforeAll(async () => {
    const body = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@mail.com',
      password: 'password',
      password2: 'password',
    };

    await request(server.app).post('/api/auth/register').send(body);

    await db.query(
      'UPDATE users SET active = true WHERE email = "testuser@mail.com"'
    );
  });

  afterAll(async () => {
    await db.query('DELETE FROM users WHERE email = "testuser@mail.com"');
  });

  test('POST / should create new task in database', async (done) => {
    const login = { email: 'testuser@mail.com', password: 'password' };

    const user = await request(server.app).post('/api/auth/login').send(login);

    const testTask = {
      name: 'Here is a task',
      projectNumber: 82,
      hoursAvailableToWork: 100,
      numberOfReviews: 2,
      reviewHours: 3,
      hoursRequiredByBim: 1,
    };

    const response = await request(server.app)
      .post('/api/task')
      .set('Authorization', `Bearer ${user.body.jwt}`)
      .send(testTask);
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual('Task Created!');
    done();
  });

  test('PUT /:id should update a task in database', async (done) => {
    const login = { email: 'testuser@mail.com', password: 'password' };

    const user = await request(server.app).post('/api/auth/login').send(login);

    const testUpdatedTask = {
      name: 'Here is a task',
      projectNumber: 82,
      hoursAvailableToWork: 100,
      numberOfReviews: 2,
      reviewHours: 3,
      hoursRequiredByBim: 2,
      UserId: user.body.id,
    };

    const response = await request(server.app)
      .put('/api/task/' + testUpdatedTask.projectNumber)
      .set('Authorization', `Bearer ${user.body.jwt}`)
      .send(testUpdatedTask);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Task Updated!');
    done();
  });

  test('DELETE /:id should delete a task from database', async (done) => {
    const login = { email: 'testuser@mail.com', password: 'password' };

    const user = await request(server.app).post('/api/auth/login').send(login);

    const response = await request(server.app)
      .delete('/api/task/82')
      .set('Authorization', `Bearer ${user.body.jwt}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Task Deleted!');
    done();
  });
});
