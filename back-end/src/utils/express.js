module.exports = {
  errorHandler(err, req, res, next) {
    const message = err.message || err;
    console.log(message);
    res.status(500).send({ message });
  }
}