import { Router } from 'express';
import {
  ProductCreateDto,
  ProductUpdateDto,
} from '@features/product/models/product.dtos';
import { asyncRouteHandler, uploadImage } from '@core/middlewares';
import { mapRequestToProductDto } from './product.mapper';
import { ProductsService } from '@features/product/application';

export const router = Router();
const productsService = new ProductsService();

// DELETE Product
router.delete(
  '/:id',
  asyncRouteHandler(async (req, res) => {
    const result = await productsService.delete(req.params.id);
    return res.status(200).json(result);
  })
);

// POST Create Product
router.post(
  '/',
  uploadImage.single('image'),
  asyncRouteHandler(async (req, res) => {
    const productCreate = mapRequestToProductDto(
      req.body,
      req.file
    ) as ProductCreateDto;

    const result = await productsService.create(
      productCreate,
      req.file?.originalname || ''
    );
    return res.status(201).send(result);
  })
);

// PUT Update Product
router.put(
  '/',
  uploadImage.single('image'),
  asyncRouteHandler(async (req, res) => {
    const productUpdate = mapRequestToProductDto(
      req.body,
      req.file
    ) as ProductUpdateDto;

    const result = await productsService.update(
      productUpdate,
      req.file?.originalname
    );
    return res.status(200).send(result);
  })
);

// GET Product by SKU
router.get(
  '/sku/:sku',
  asyncRouteHandler(async (req, res) => {
    const product = await productsService.findBySku(req.params.sku);
    return res.status(200).send(product);
  })
);

// GET Products listing
router.get(
  '/',
  asyncRouteHandler(async (req, res) => {
    const results = await productsService.fetchProducts({
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      take: req.query.pageSize
        ? parseInt(req.query.pageSize as string)
        : undefined,
    });
    return res.status(200).send(results || []);
  })
);
