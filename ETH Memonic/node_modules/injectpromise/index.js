module.exports = function (scope) {
  return (func, ...args) => {
    return (function (func, ...args) {
      return new Promise((resolve, reject) => {
        func(...args, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    })(func.bind(scope), ...args)
  }
}
