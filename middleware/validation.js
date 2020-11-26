const validator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const errorMessages = details.map((i) => i.message).join(",");
      res.status(422).json({
        status: false,
        data: "",
        message: errorMessages,
      });
    }
  };
};

module.exports = validator;
