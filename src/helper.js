const Busboy = require('busboy')
const uuid = require('uuid/v4')
const path = require('path')
const fs = require('fs')

module.exports = {
  uploadImg(request, pathToSave, newFileName) {
    return new Promise((resolve, reject) => {
      const busboy = new Busboy({
        headers: request.headers,
        limits: { files: 1 },
      })
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const [typeFile, extFile] = mimetype.split('/')

        if (typeFile !== 'image') {
          reject(new Error('File must be image'))
        }
        const newImgName = `${newFileName}.${extFile}`
        const saveTo = path.resolve(pathToSave, `${newImgName}`)

        file.pipe(fs.createWriteStream(saveTo))

        resolve(newImgName)
      })
      request.pipe(busboy)
    })
  },

  randomStringCookie() {
    return uuid()
  },
  randomStringFile() {
    return uuid()
  },
}
