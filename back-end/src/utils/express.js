module.exports = {
  errorHandler(err, req, res, next) {
    // custom application error
    if (typeof (err) === 'string') {
      return res.status(400).send({ message: err });
    }

    // joi validation error
    if (err.name === 'ValidationError' && err.isJoi) {
      return res.status(400).send({ message: err.details[0].message });
    }

    // default to 500 server error
    res.status(500).send({ message: err.message });
  }
};