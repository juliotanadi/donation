class Response {
    constructor(code, message, data = null) {
        this.code = code
        this.message = message
        this.data = data
    }
}

module.exports = Response
