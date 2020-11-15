import * as request from 'supertest';
import db from '../../models/models';
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

describe('POST /login and GET /token', () => {
  afterAll(async () => {
    await db.query('DELETE FROM users WHERE email = "newuser@mail.com"');
  });

  test('It should response with status code 400 when the user registers but does not activate account', async (done) => {
    const body = {
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@mail.com',
      password: 'password',
      password2: 'password',
    };

    await request(server.app).post('/api/auth/register').send(body);

    const response = await request(server.app)
      .post('/api/auth/login')
      .send(body);
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Email has not been verified',
    });

    await db.query(
      'UPDATE users SET active = true WHERE email = "newuser@mail.com"'
    );
    done();
  });

  test('It should send a JSON web token when active account is logged in to', async (done) => {
    const body = {
      email: 'newuser@mail.com',
      password: 'password',
    };

    const response = await request(server.app)
      .post('/api/auth/login')
      .send(body);
    expect(response.status).toBe(200);
    expect(response.body.jwt).not.toBe(null);
    expect(response.body.user.firstName).toBe('New');
    expect(response.body.user.lastName).toBe('User');
    expect(response.body.user.email).toBe('newuser@mail.com');
    done();
  });

  test('It should allow user access /token with JWT', async (done) => {
    const body = {
      email: 'newuser@mail.com',
      password: 'password',
    };

    const postResponse = await request(server.app)
      .post('/api/auth/login')
      .send(body);

    const getResponse = await request(server.app)
      .get('/api/auth/token')
      .set('Authorization', `Bearer ${postResponse.body.jwt}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.message).toBe('Currently logged in');
    expect(getResponse.body.user.firstName).toBe('New');
    expect(getResponse.body.user.lastName).toBe('User');
    expect(getResponse.body.user.email).toBe('newuser@mail.com');
    done();
  });

  test('It should deny user access to /token without JWT', async (done) => {
    const getResponse = await request(server.app).get('/api/auth/token');
    expect(getResponse.status).toBe(401);
    done();
  });
});
