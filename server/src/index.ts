import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mailingRoutes from './routes/mailingRoutes';
import giftCardRoutes from './routes/giftCardRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', mailingRoutes);
app.use('/api', giftCardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
