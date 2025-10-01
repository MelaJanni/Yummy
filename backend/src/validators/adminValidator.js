const { z } = require('zod');

const approveRecipeSchema = z.object({
  requiresReview: z.boolean().optional()
});

const rejectRecipeSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required').max(500)
});

module.exports = {
  approveRecipeSchema,
  rejectRecipeSchema
};
