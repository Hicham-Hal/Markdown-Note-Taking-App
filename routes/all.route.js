import express from 'express'
import { checkGrammar, deleteNote, getNotes, getSingleNote, postNotes, updateNote } from '../controllers/all.controller.js'
import multer from 'multer'
const route = express.Router()
const upload = multer({ dest: 'storage/notes/' })


route.post('/', upload.single('markdown'), postNotes)
route.put('/:id', upload.single('markdown'), updateNote)
route.delete('/:id', deleteNote)
route.get('/', getNotes)
route.get('/:id', getSingleNote)
route.get('/grammar/:id', checkGrammar)

export default route