const fs = require('fs')

module.exports = dir => {
  return new Promise((resolve, reject) => {
    fs.lstat(dir, (err, stat) => {
      if (err) return reject(err)

      return resolve(stat)
    })
  })
}
