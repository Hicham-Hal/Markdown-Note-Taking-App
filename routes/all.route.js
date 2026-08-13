import express from 'express'
import { deleteNote, getNotes, getSingleNote, postNotes, updateNote } from '../controllers/all.controller.js'
import multer from 'multer'
const route = express.Router()
const upload = multer({ dest: 'storage/notes/' })


route.get('/', getNotes)
route.post('/', upload.single('markdown'), postNotes)
route.get('/:id', getSingleNote)
route.post('/delete/:id', deleteNote)
route.put('/:id', upload.single('markdown'), updateNote)

export default route