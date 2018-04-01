const latinize = require('latinize')
const uuid = require('uuid/v4')

module.exports = {
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
