import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ProductRoute from './routes/ProductRoute.js';
import userRouter from './routes/UserRoute.js';

dotenv.config({ path: 'server.env' })
const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.end('Home')
})

app.use(ProductRoute)
app.use('/users', userRouter)


const port = process.env.SERVER_PORT

app.listen(port, () => {
    console.log(`server up and running on port ${port}`)
})