const response = (res, success, data, message) => {
  if (success) {
    res.status(200);
  } else {
    res.status(400);
  }
  res.json({
    success: success,
    data: data,
    message: message,
  });
};

module.exports = response;
