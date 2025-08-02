const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Get token from cookie
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;
