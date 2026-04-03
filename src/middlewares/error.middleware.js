function errorMiddleware(err, req, res, next) {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  // console.log("ERROR STACK:", err.stack);

  res.status(statusCode).json({
    success: false,
    message: message,
    detail: err.detail || null,
  }); 
}

export default errorMiddleware;
