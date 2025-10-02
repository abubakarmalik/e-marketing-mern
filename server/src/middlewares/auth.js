const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const User = require('../models/user.model');

const sendError = (res, code, message, details) =>
  res.status(code).json({
    success: false,
    message,
    data: null,
    error: { code, details },
  });

const extractBearer = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (!/^Bearer$/i.test(scheme)) return null;
  return token || null;
};

// include tokenVersion in payload
const signToken = (user, options = {}) => {
  const expiresIn = options.expiresIn || env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: user._id.toString(), tv: user.tokenVersion }, // tv = tokenVersion
    env.JWT_SECRET,
    { expiresIn },
  );
};

async function requireAuth(req, res, next) {
  try {
    const token = extractBearer(req);

    if (!token)
      return sendError(res, 401, 'Unauthorized', 'Missing Bearer token');

    const payload = jwt.verify(token, env.JWT_SECRET); // { id, tv, iat, exp }
    if (!payload?.id)
      return sendError(res, 401, 'Invalid or expired token', 'Bad payload');

    const user = await User.findById(payload.id).select(
      '_id tokenVersion name username',
    );
    if (!user)
      return sendError(res, 401, 'Invalid or expired token', 'User not found');

    // compare token version
    if (payload.tv !== user.tokenVersion) {
      return sendError(res, 401, 'Unauthorized', 'Token has been invalidated');
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
    };
    req.tokenPayload = payload;
    return next();
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired token', err.message);
  }
}

module.exports = { requireAuth, signToken };
