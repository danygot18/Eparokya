const express = require("express");
const {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  borrowInventoryItem,
  returnInventoryItem,
  getBorrowHistory
} = require("../controllers/InventoryController.js");
const { isAuthenticatedUser, isAuthorized } = require("../middleware/auth.js");

const router = express.Router();

router.route('/inventory')
  .get(getAllInventoryItems)
  .post(isAuthenticatedUser, isAuthorized('admin', 'staff'), createInventoryItem);

router.route('/inventory/low-stock')
  .get(isAuthenticatedUser, getLowStockItems);

router.route('/inventory/:id')
  .get(getInventoryItem)
  .delete(isAuthenticatedUser, isAuthorized('admin'), deleteInventoryItem);

router.put('/inventory/:id', isAuthenticatedUser, isAuthorized('admin'), updateInventoryItem);

router.route('/inventory/:id/borrow')
  .post(isAuthenticatedUser, borrowInventoryItem);

router.route('/inventory/:id/return')
  .post(isAuthenticatedUser, returnInventoryItem);

router.route('/inventory/:id/borrow-history')
  .get(isAuthenticatedUser, getBorrowHistory);

module.exports = router;