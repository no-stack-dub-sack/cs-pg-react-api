const CodeStrings = require('./model.js')
const mongoose    = require('mongoose')

const error = (err) =>
  console.error(`MongoDB Error: ${err}`)

// NOTE: CHANGE FOR PROD!!!
const re = process.env.NODE_ENV === 'production'
  ? /^https?:\/\/questionable-number.surge.sh/
  : /^http:\/\/localhost:3000/

// only allow calls from cs-pg-react with api_key
const isAuthorized = (api_key, refAddress, type) => {
  if (api_key !== process.env.API_KEY || !re.test(refAddress)) {
    console.warn(`Unauthorized ${type} request!`)
    return false
  }
  return true
}

module.exports = {
  // POST api/insert-code
  insertCode: (req, res) => {
    const { api_key, code } = req.body
    const _id = mongoose.Types.ObjectId()
    if (!isAuthorized(api_key, req.headers.referer, 'POST')) {
      res.status(401)
    } else {
      // if exact code string already stored, don't dupe
      CodeStrings.findOne({ code }, (err, string) => {
        if (err)
          error(err), res.status(500)
        if (!string) {
          console.log('Saving code...')
          CodeStrings.create({ _id, code }, (err) => {
            if (err)
              error(err), res.status(500)
            res.send({ hash: _id.toString() })
          })
        } else {
          console.log('Retrieving hash for already saved code...')
          res.send({ hash: string._id.toString() })
        }
      })
    }
  },
  // GET get-code/API_KEY/ID
  getCode: (req, res) => {
    const { params: { api_key, id } } = req
    if (!isAuthorized(api_key, req.headers.referer, 'GET')) {
      res.status(401)
    } else {
      console.log('Retrieving code...')
      CodeStrings.findById(id, (err, strings) => {
        if (err) {
          error(err)
          res.send('// Sorry, an error has occured, please try again!')
        }
        if (!strings) {
          res.send('// Sorry, this repl does not exist')
        }
        // send code to user
        res.send(strings.code)
      })
    }
  }
}
