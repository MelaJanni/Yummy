const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { approveRecipeSchema, rejectRecipeSchema } = require('../validators/adminValidator');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/recipes/pending', adminController.getPendingRecipes);
router.patch('/recipes/:id/approve', validate(approveRecipeSchema), adminController.approveRecipe);
router.patch('/recipes/:id/reject', validate(rejectRecipeSchema), adminController.rejectRecipe);
router.get('/stats', adminController.getStats);

router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id', adminController.updateUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

router.get('/recipes', adminController.getAllRecipes);
router.patch('/recipes/:id', adminController.updateRecipe);
router.delete('/recipes/:id', adminController.deleteRecipe);

module.exports = router;
