import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Backend API is running! Debug mode');
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

export default app;
