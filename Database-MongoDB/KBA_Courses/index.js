import express, { json } from 'express';

import { route } from './Routes/adminRoutes_DB.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express(); //creating an instance of imported 'express'
app.use(json()) //we call inbuilt functions using express instance(app).use
app.use('/',route)

const port = process.env.port;

app.listen(port, () => {
    console.log(`Server is listening to port: ${port}`)
})