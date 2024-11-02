import express,{json} from 'express';
import dotenv from 'dotenv';
import { adminRoutes } from './Router/signuproute.js';

dotenv.config();
const certiapp = express();

certiapp.use(json());
certiapp.use('/', adminRoutes);

const port = process.env.port;

certiapp.listen(port, () => {

    console.log(`Server is listening port: ${port}`)
})