import { Router } from 'express';
import {
  listAuctions,
  createAuction,
  getAuction,
  updateAuction,
  deleteAuction,
} from '../controllers/auctionController.js';
import { listLots, createLot } from '../controllers/lotController.js';

const router = Router();

router.route('/').get(listAuctions).post(createAuction);
router.route('/:id').get(getAuction).put(updateAuction).delete(deleteAuction);
router.route('/:id/lots').get(listLots).post(createLot);

export default router;

