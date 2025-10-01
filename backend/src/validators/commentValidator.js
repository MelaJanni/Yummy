const { z } = require('zod');

const createCommentSchema = z.object({
  body: z.string().min(1, 'Comment body is required').max(1000, 'Comment must be less than 1000 characters'),
  parentId: z.number().int().positive().optional(),
  guestName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  guestEmail: z.string().email('Invalid email').max(255).optional()
});

module.exports = {
  createCommentSchema
};
