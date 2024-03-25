import express from 'express';
import { addEvent, findEvents } from '../controllers/eventController.js';

const router = express.Router();

router.post('/add', addEvent);

router.get('/find', findEvents);

export default router;
