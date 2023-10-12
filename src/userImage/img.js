import express from 'express';
import fs from 'fs'
import multer from 'multer'
const app = express();
const port = 8080;

import path from "path"
const __dirname = path.resolve();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Configure Multer middleware to handle file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = `${__dirname}/image_user/${req.query.id}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            fs.writeFile(`${dir}/img.jpg`, '', function (err) {
                if (err) throw err; console.log('Results Received');
            })
        }
        let oldfile = getFiles(dir)
        if(oldfile == 0){
            fs.writeFile(`${dir}/img.jpg`, '', function (err) {
                if (err) throw err; console.log('Results Received');
            })
            oldfile = getFiles(dir)
        }
        const old_file_extension = oldfile[0].split('.').pop()
        fs.rmSync(`${__dirname}/image_user/${req.query.id}/img.${old_file_extension}`)
        cb(null, `./image_user/${req.query.id}/`)  // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        const file_ext = file.originalname.split('.').pop()
        cb(null, `img.${file_ext}`) // Use the original file name for uploaded files
    }


});




const upload = multer({ storage: storage });


app.get(`/userimg/getimg`, async (req, res) => {
    try {
        const dir = `${__dirname}/image_user/${req.query.id}`
        const file = getFiles(dir)
        const file_extension = file[0].split('.').pop()
        res.sendFile(`${__dirname}/image_user/${req.query.id}/img.${file_extension}`)
    } catch (e) {
        res.sendFile(`${__dirname}/default_profile.jpg`)
    }
})

app.post(`/userimg/chageimg`, upload.single('file'), async (req, res) => {
    try {

        res.sendStatus(200)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})


function imageStoreCheck() {
    try {
        const dir = `${__dirname}/image_user/`
        const file = getFiles(dir)
    } catch (error) {
        fs.mkdirSync('image_user');
    }
}
imageStoreCheck()
// Recursive function to get files
function getFiles(dir, files = []) {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFiles(name, files);
        } else {
            // If it is a file, push the full path to the files array
            files.push(name);
        }
    }
    return files;
}