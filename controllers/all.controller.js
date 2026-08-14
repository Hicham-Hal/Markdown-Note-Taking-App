import fs from 'fs'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const getNotes = async(req, res) => {
    try{
        if(!fs.existsSync(path.join('data', 'notes.json'))){
            return res.status(404).json({ msg: 'no note found' })
        }

        const data = await fs.promises.readFile(path.join('data', 'notes.json'), 'utf8')
        const parsedData = JSON.parse(data)
        return res.status(200).json(parsedData)
    }catch(err){
        console.log(err)
        return res.status(500).json({ msg: 'server error' })
    }
}

export const postNotes = async(req, res) => {
    const { title } = req.body
    if(!title){
        return res.status(401).json({ msg: 'Title field is required' })
    }
    let dataNotes = []
    if(!req.file){
        return res.status(401).json({ msg: 'You should implement the markdown file' })
    }
    try{
        if(fs.existsSync(path.join('data', 'notes.json'))){
            const notes = await fs.promises.readFile(path.join('data', 'notes.json'), 'utf8')
            const parsedNotes = JSON.parse(notes)
            dataNotes = parsedNotes
        }
        const newNote = {
            id: req.file.filename,
            title: title,
            fileName: req.file.originalname
        };

        dataNotes.push(newNote)

        await fs.promises.writeFile(path.join('data',`notes.json`), JSON.stringify(dataNotes))
        return res.status(201).json({ msg: "Note created" })
    }catch(err){
        console.log(err)
        return res.status(500).json({ msg: 'server error' })
    }
}

export const getSingleNote = async(req, res) => {
    const {id} = req.params
    const DOMPurify = createDOMPurify(new JSDOM('').window)
    try{
        if(!fs.existsSync(path.join('storage/notes', `${id}`))){
            return res.status(404).json({ msg: 'no note found' })
        }
        const jsonData = await fs.promises.readFile(path.join('data', 'notes.json'), 'utf8')
        const parsedJsonData = JSON.parse(jsonData)
        const single = parsedJsonData.find(item => item.id === id)
        const data = await fs.promises.readFile(path.join('storage/notes', `${id}`), 'utf8')
        const rawHtml = marked(data)
        const returnedRaw = DOMPurify.sanitize(rawHtml)
        return res.status(200).json({Note: single, HtmlRaw: returnedRaw})
    }catch(err){
        console.log(err)
        return res.status(500).json({ msg: 'server error' })
    }
}

export const deleteNote = async(req, res) => {
    const { id } = req.params
    try{
        if(!fs.existsSync(path.join('data', 'notes.json'))){
            return res.status(200).json({ msg: 'no notes found' })
        }
        const data = await fs.promises.readFile(path.join('data', 'notes.json'), 'utf8')
        const parsedData = JSON.parse(data)
        const newData = parsedData.filter(item => item.id !== id)
        await fs.promises.unlink(path.join('storage/notes', `${id}`))
        await fs.promises.writeFile(path.join('data', 'notes.json'), JSON.stringify(newData))
        return res.status(204).end()
    }catch(err){
        console.log(err)
        return res.status(500).json({ msg: 'server error' })
    }
}

export const updateNote = async(req, res) => {
    const { id } = req.params
    const { title } = req.body
    try{
        if(!fs.existsSync(path.join('data', 'notes.json'))){
            return res.status(404).json({ msg: 'no note found' })
        }
        const notes = await fs.promises.readFile(path.join('data', 'notes.json'), 'utf8')
        const parsedNotes = JSON.parse(notes)
        const note = parsedNotes.find(item => item.id === id)
        if(!note) return res.status(404).json({ msg: 'no note found' })
        if(req.file){
            await fs.promises.unlink(path.join('storage/notes', `${note.id}`))
        }
        note.title = title;
        note.id = req.file? req.file.filename : note.id
        note.fileName = req.file? req.file.originalname : note.fileName
        await fs.promises.writeFile(path.join('data', 'notes.json'), JSON.stringify(parsedNotes))
        res.status(200).json(note)
    }catch(err){
        console.log(err)
        return res.status(500).json({ msg: 'server error' })
    }
}

export const checkGrammar = async(req, res) => {
    const { id } = req.params
    try{
        const file = await fs.promises.readFile(path.join('storage/notes', `${id}`), 'utf8')
        const params = new URLSearchParams({ text: file, language: 'en-US' })
        const response = await fetch(`https://api.languagetool.org/v2/check`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        })
        if(response.status !== 200){
            return res.status(502).json({ msg: 'Something went wrong, Bad Gateway' })
        }
        const data = await response.json()
        return res.status(200).json(data)
    }catch(err){
        console.log(err)
        return res.status(500).json({ msg: 'server error' })
    }
}