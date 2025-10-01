const success = (data) => {
  return {
    success: true,
    data
  };
};

const error = (code, message, details = null) => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  };
};

module.exports = {
  success,
  error
};
