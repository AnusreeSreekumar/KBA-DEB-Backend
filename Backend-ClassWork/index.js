import express, { json } from 'express';

import { route } from './Routes/adminRoutes.js';

const app = express(); //creating an instance of imported 'express'
app.use(json()) //we call inbuilt functions using express instance(app).use
app.use('/',route)

const port = 8000;

app.listen(port, () => {
    console.log(`Server is listening to port: ${port}`)
})