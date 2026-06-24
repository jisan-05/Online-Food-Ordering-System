function errorHandler(error, _req, res, _next) {
  console.error(error)

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(', '),
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${error.path}` })
  }

  return res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error',
  })
}

export default errorHandler
