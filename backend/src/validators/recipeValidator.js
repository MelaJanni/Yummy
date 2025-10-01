const { z } = require('zod');

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  order: z.number().int().min(0).optional()
});

const stepSchema = z.object({
  order: z.number().int().min(1),
  text: z.string().min(1, 'Step text is required')
});

const createRecipeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().optional(),
  cuisine: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  minutes: z.number().int().min(1, 'Minutes must be at least 1'),
  servings: z.number().int().min(1, 'Servings must be at least 1'),
  imageUrl: z.string().url().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(stepSchema).min(1, 'At least one step is required'),
  tags: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  diets: z.array(z.string()).optional(),
  status: z.enum(['draft', 'pending']).optional()
});

const updateRecipeSchema = createRecipeSchema.partial();

module.exports = {
  createRecipeSchema,
  updateRecipeSchema
};
