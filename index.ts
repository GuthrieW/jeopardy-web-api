import express, { Application } from 'express'
import dotenv from '@dotenvx/dotenvx'

dotenv.config()

const app: Application = express();
const port = process.env.PORT || 8000;


app.use('/settings',);
app.use('/game',);
app.use('/statistics',);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});