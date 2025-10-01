const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema
} = require('../validators/authValidator');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/forgot', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset', validate(resetPasswordSchema), authController.resetPassword);

router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.put('/me/password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
