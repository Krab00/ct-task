import { Router } from 'express';
import { ProductsService } from './products.service';
import { ProductCreateDto } from '@features/product/models/product.dtos';
import { asyncRouteHandler, uploadImage } from '@core/middlewares';

export const router = Router();
const productsService = new ProductsService();

// POST Create Product
router.post(
  '/',
  uploadImage.single('image'),
  asyncRouteHandler(async (req, res) => {
    const productCreate: ProductCreateDto = {
      ...req.body,
      quantity: req.body.quantity ? parseInt(req.body.quantity, 10) : 0,
      unitPrice: req.body.unitPrice ? parseFloat(req.body.unitPrice) : 0,
      image: req.file ? req.file.originalname : null,
    };

    const result = await productsService.create(
      productCreate,
      req.file?.originalname || ''
    );
    return res.status(201).send(result);
  })
);

// GET Products listing
router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const results = await productsService.fetchProducts();
    return res.status(200).send(results || []);
  })
);
