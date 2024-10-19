import express,{json} from 'express';
import { userroute } from './Router/userroute.js';
import { adminRoutes } from './Router/signuproute.js';

const certiapp = express();
certiapp.use(json());
const port = 8000;

certiapp.use('/',userroute, adminRoutes);

certiapp.listen(port, () => {

    console.log(`Server is listening port: ${port}`)
})