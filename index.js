import express, { urlencoded } from 'express'
import routes from './routes/all.route.js'
import ejs from 'ejs'

const app = express()
app.set('view engine', 'ejs')
app.set('/views', 'views')
app.use(urlencoded({ extended: false }))
app.use(express.json())

app.use('/notes', routes)


app.listen(3000, () => {
    console.log(`The server is running on PORT: 3000`)
})