const errorHandler = (err, req, res, next) => {
  //----- Set Status Code (Default To 500 If Response Status Is 200) -----
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  //----- Send JSON Response With Error Message -----
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "Development" ? err.stack : {},
  });
};

module.exports = {
  errorHandler,
};
