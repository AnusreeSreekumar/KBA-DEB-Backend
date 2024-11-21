import express,{json} from 'express';
import {adminRouter} from './Routes/adminRouter.js'
import cors from 'cors';

const libapp = express();

libapp.use(cors({
    origin : 'http://127.0.0.1:5501',
    credentials : true,
    allowedHeaders : ['Content-Type', 'Authorization']
}));

const port = 8000

libapp.use(json());
libapp.use('/', adminRouter);

libapp.listen(port, () => {
    console.log(`Server is listening port: ${port}`);
})