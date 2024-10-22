import express from 'express';
import sinRouter from './routers/sinRouter';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', sinRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
