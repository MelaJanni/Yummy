const { verifyAccessToken } = require('../utils/jwt');
const { error } = require('../utils/response');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(error('UNAUTHORIZED', 'No token provided'));
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json(error('UNAUTHORIZED', 'Invalid or expired token'));
  }

  req.user = decoded;
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(error('UNAUTHORIZED', 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(error('FORBIDDEN', 'Insufficient permissions'));
    }

    next();
  };
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
