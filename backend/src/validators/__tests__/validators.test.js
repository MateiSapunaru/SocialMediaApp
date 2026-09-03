const express = require('express');
const request = require('supertest');
const { registerValidation, loginValidation } = require('../authValidators');
const { createPostValidation, commentValidation } = require('../postValidators');
const validate = require('../../middlewares/validationMiddleware');

function buildApp(validators) {
  const app = express();
  app.use(express.json());
  app.post('/test', validators, validate, (req, res) => res.status(200).json({ ok: true }));
  return app;
}

describe('registerValidation', () => {
  const app = buildApp(registerValidation);

  it('rejects a short password', async () => {
    const res = await request(app)
      .post('/test')
      .send({ username: 'bob', email: 'bob@test.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('rejects an invalid email', async () => {
    const res = await request(app)
      .post('/test')
      .send({ username: 'bob', email: 'not-an-email', password: 'longenough' });
    expect(res.status).toBe(400);
  });

  it('rejects a too-short username', async () => {
    const res = await request(app)
      .post('/test')
      .send({ username: 'ab', email: 'bob@test.com', password: 'longenough' });
    expect(res.status).toBe(400);
  });

  it('accepts valid input', async () => {
    const res = await request(app)
      .post('/test')
      .send({ username: 'bob', email: 'bob@test.com', password: 'longenough' });
    expect(res.status).toBe(200);
  });
});

describe('loginValidation', () => {
  const app = buildApp(loginValidation);

  it('rejects a missing password', async () => {
    const res = await request(app).post('/test').send({ email: 'bob@test.com' });
    expect(res.status).toBe(400);
  });

  it('accepts valid input', async () => {
    const res = await request(app).post('/test').send({ email: 'bob@test.com', password: 'x' });
    expect(res.status).toBe(200);
  });
});

describe('createPostValidation', () => {
  const app = buildApp(createPostValidation);

  it('rejects empty content', async () => {
    const res = await request(app).post('/test').send({ title: 'hi', content: '   ' });
    expect(res.status).toBe(400);
  });

  it('accepts a post with no title', async () => {
    const res = await request(app).post('/test').send({ content: 'hello world' });
    expect(res.status).toBe(200);
  });
});

describe('commentValidation', () => {
  const app = buildApp(commentValidation);

  it('rejects empty content', async () => {
    const res = await request(app).post('/test').send({ content: '' });
    expect(res.status).toBe(400);
  });

  it('accepts non-empty content', async () => {
    const res = await request(app).post('/test').send({ content: 'nice post' });
    expect(res.status).toBe(200);
  });
});
