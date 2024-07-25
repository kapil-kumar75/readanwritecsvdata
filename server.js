import axios from 'axios'
import express from 'express'
import router from './routes/api.js'
import ConnectDataBase from './util/connectDb.js'

const app = express()

const PORT = 4590

ConnectDataBase()

app.use(express.json())
app.use(express.static('public'))

app.use('/api', router)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

