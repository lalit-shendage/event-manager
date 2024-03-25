import express from 'express';
import bodyParser from 'body-parser';
import eventRoutes from './routes/eventRoutes.js';
import database from './config/db.js'

const app = express();

database();

const PORT= process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
