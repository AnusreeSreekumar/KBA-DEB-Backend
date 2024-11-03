import express,{json} from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { adminRoutes } from './Router/signuproute_intgrtn.js';

dotenv.config();
const certiapp = express();

// Enable CORS
certiapp.use(cors({
    origin: 'http://127.0.0.1:5500', // Change this to '*' if you want to allow all origins
    credentials: true    
  }));

certiapp.use(json());
certiapp.use('/', adminRoutes);

const port = process.env.port;

certiapp.listen(port, () => {

    console.log(`Server is listening port: ${port}`)
})