const handleValidationError = (err, res) => {
  let errors = err.errors.map((el) => el.message);

  if (errors.length > 1) {
    let chain = "";

    errors.forEach((error) => {
      chain += error + " || ";
    });

    const msgErr = chain.slice(0, -4);

    res.status(400).send({ messages: msgErr });
  } else {
    res.status(400).send({ messages: errors });
  }
};

const typeError = (err, req, res, next) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return (err = handleValidationError(err, res));
  } else {
    res.status(500).send({ msg: "Hubo un problema" });
  }
};

module.exports = { typeError };
