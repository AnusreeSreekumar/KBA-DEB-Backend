import express,{json} from 'express';
import { userroute } from './Router/userroute.js';

const certiapp = express();
certiapp.use(json());
const port = 8000;

certiapp.use('/',userroute)

certiapp.listen(port, () => {

    console.log(`Server is listening port: ${port}`)
})