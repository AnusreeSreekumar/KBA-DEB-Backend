import express,{json} from 'express';
import { adminRoutes } from './Router/signuproute.js';

const certiapp = express();
certiapp.use(json());
const port = 5000;

certiapp.use('/', adminRoutes);

certiapp.listen(port, () => {

    console.log(`Server is listening port: ${port}`)
})