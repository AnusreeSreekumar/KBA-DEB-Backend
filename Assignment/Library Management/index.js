import express,{json} from 'express';

const libexp = express();
const port = 8000;

libexp.use(json());
libexp.use('/',adminRouter);

libexp.listen(port, () => {

    console.log(`Server is listening port: ${port}`);
});