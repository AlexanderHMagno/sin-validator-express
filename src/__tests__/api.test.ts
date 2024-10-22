import request from 'supertest';
import app from '../index'; // Adjust the path as necessary
import { fakeValidSins } from '../utils/sinFakeNumbers';
import { Server } from 'http';

let server: Server;

beforeAll((done) => {
  server = app.listen(3002, () => {
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('GET /api/validate/:sin', () => {
  it('should return an error if the SIN does not have 9 digits', async () => {
    const response = await request(app).get('/api/validate/12345678');
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(
      "Well Well, it looks like your SIN doesn't have 9 digits, try again"
    );
  });

  it('should return an error if the SIN contains non-numeric characters', async () => {
    const response = await request(app).get('/api/validate/12345678a');
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(
      'Well Well, have you seen a SIN with letters?, Please add a Valid SIN'
    );
  });

  it('should return an error if the SIN does not pass the Luhn algorithm', async () => {
    const response = await request(app).get('/api/validate/123456789');
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain(
      'Mr Hans Peter Luhn says this is not a valid SIN'
    );
  });

  it('should return success if the SIN is valid', async () => {
    const response = await request(app).get('/api/validate/046454286');
    expect(response.status).toBe(200);
    expect(response.body.isValid).toBe(true);
  });

  it('should validate all fake valid SINs correctly', async () => {
    for (const sin of fakeValidSins.slice(0, 6)) {
      const response = await request(app).get(`/api/validate/${sin}`);
      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
    }
  });

  ///Before this there are 10 request, just test remove ratelimiter limit to make a better test from here
  it('Should fail Rate Limiter', async () => {
    const response = await request(app).get(`/api/validate/111`);
    expect(response.status).toBe(429);
    expect(response.body.isError).toBe(true);
  });
});
