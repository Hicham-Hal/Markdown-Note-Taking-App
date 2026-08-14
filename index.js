import express, { urlencoded } from 'express'
import routes from './routes/all.route.js'

const app = express()
app.use(urlencoded({ extended: false }))
app.use(express.json())

app.use('/notes', routes)


app.listen(3000, () => {
    console.log(`The server is running on PORT: 3000`)
})