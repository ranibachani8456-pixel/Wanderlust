//making an error classs used inheritance that we studied in oops
class expressError extends Error {
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = expressError;