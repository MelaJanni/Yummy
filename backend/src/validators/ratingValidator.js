const { z } = require('zod');

const createRatingSchema = z.object({
  score: z.number().int().min(1, 'Score must be at least 1').max(5, 'Score must be at most 5'),
  comment: z.string().max(500).optional()
});

const updateRatingSchema = createRatingSchema;

module.exports = {
  createRatingSchema,
  updateRatingSchema
};
