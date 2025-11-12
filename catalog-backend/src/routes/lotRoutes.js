import { Router } from 'express';
import {
  getLot,
  updateLot,
  deleteLot,
  bulkLotAction,
  reorderLots,
  importLots,
  exportLots,
  lotsUploadMiddleware,
} from '../controllers/lotController.js';

const router = Router();

router.get('/export', exportLots);
router.post('/bulk', bulkLotAction);
router.put('/reorder', reorderLots);
router.post('/import', lotsUploadMiddleware, importLots);
router.route('/:lotId').get(getLot).patch(updateLot).delete(deleteLot);

export default router;

