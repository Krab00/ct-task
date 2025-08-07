import Joi from 'joi';
import { ProductCreateDto } from './product.dtos';

export const ProductCreateValidation = Joi.object<ProductCreateDto>({
  sku: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'SKU cannot be empty',
    'string.min': 'SKU must be at least 1 character long',
    'string.max': 'SKU cannot exceed 50 characters',
    'any.required': 'SKU is required',
  }),

  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name cannot exceed 255 characters',
    'any.required': 'Name is required',
  }),

  description: Joi.string().trim().max(4000).optional().allow('').messages({
    'string.max': 'Description cannot exceed 4000 characters',
  }),

  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity cannot be negative',
    'any.required': 'Quantity is required',
  }),

  unitPrice: Joi.number().min(0).precision(2).required().messages({
    'number.base': 'Unit price must be a number',
    'number.positive': 'Unit price must be positive',
    'any.required': 'Unit price is required',
  }),

  image: Joi.binary().optional().allow(null).messages({
    'binary.base': 'Image must be binary data',
  }),
});
