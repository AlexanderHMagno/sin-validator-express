import request from 'supertest';
import app from '../index'; // Adjust the path as necessary
import { fakeValidSins } from '../utils/sinFakeNumbers';
import { Server } from 'http';
import { POINTS } from '../middleware/rateLimit';

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
  it('should validate all fake valid SINs correctly', async () => {
    for (const sin of fakeValidSins.slice(
      0,
      Math.min(POINTS, fakeValidSins.length)
    )) {
      const response = await request(app).get(`/api/validate/${sin}`);
      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
    }
  });

  it('Should fail Rate Limiter', async () => {
    const response = await request(app).get(`/api/validate/111`);
    expect(response.status).toBe(429);
    expect(response.body.isError).toBe(true);
  });
});
