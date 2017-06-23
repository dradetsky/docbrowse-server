const reqLog = (request) => {
  let raddr = request.info.remoteAddress
  let meth = request.method.toUpperCase()
  let path = request.url.path
  let status = request.response.statusCode
  let msg = `${raddr}: ${meth} ${path} --> ${status}`
  console.log(msg)
}

module.exports = reqLog
