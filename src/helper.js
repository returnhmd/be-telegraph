const Busboy = require('busboy')
const latinize = require('latinize')
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

  normilizeStr(str, date, quantity, separator = '-') {
    const strArr = []
    const transformedStr = latinize(str)
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/ /g, separator)
    strArr.push(transformedStr)

    const [month, day] = date
      .toString()
      .split(' ')
      .slice(1, 3)
    strArr.push(day, month)

    if (quantity) strArr.push(quantity)

    return strArr.join(separator)
  },

  randomStringCookie() {
    return uuid()
  },
  randomStringFile() {
    return uuid()
  },
}
