import express, { Request, Response } from 'express';

const app = express();
const port = 3003; // You can change the port as needed

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Crawler API!');
});

app.listen(port, () => {
  console.log(`Crawler API listening at http://localhost:${port}`);
});