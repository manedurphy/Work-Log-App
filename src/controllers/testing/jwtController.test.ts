import * as request from 'supertest';
import db from '../../models/models';
import { JWTController } from '../jwtController';
import server from '../../server/server';

describe('POST /register', () => {
  afterEach(async () => {
    await db.query('DELETE FROM users WHERE email = "newuser@mail.com"');
  });

  test('It should register a user on POST /register', async (done) => {
    const body = {
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@mail.com',
      password: 'password',
      password2: 'password',
    };

    const response = await request(server.app)
      .post('/api/auth/register')
      .send(body);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true });
    done();
  });

  test('It should response with a 400 status code when input required property is missing on request body', async (done) => {
    const body = {
      firstName: 'New',
      lastName: 'User',
      password: 'password',
      password2: 'password',
    };

    const response = await request(server.app)
      .post('/api/auth/register')
      .send(body);
    expect(response.status).toBe(400);
    done();
  });

  test('It should response with a 400 status code when passwords do not match', async (done) => {
    const body = {
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@mail.com',
      password: 'password',
      password2: 'passwords',
    };

    const response = await request(server.app)
      .post('/api/auth/register')
      .send(body);
    expect(response.status).toBe(400);
    done();
  });
});
