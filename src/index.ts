import express from 'express';
import sinRouter from './routers/sinRouter';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', sinRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
export default app;
