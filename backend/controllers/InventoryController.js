const Inventory = require('../models/Inventory.js');
const ErrorHandler = require('../helpers/error-handler.js');

// Create new inventory item => /api/v1/inventory/new
const createInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.create(req.body);
    res.status(201).json({
      success: true,
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

// Get all inventory items => /api/v1/inventory
const getAllInventoryItems = async (req, res, next) => {
  try {
    const resPerPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    
    // Build query
    const query = {};
    
    // Search functionality
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Execute count query first
    const inventoryCount = await Inventory.countDocuments(query);
    
    // Get paginated results
    const inventoryItems = await Inventory.find(query)
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage);

    res.status(200).json({
      success: true,
      count: inventoryItems.length,
      inventoryCount,
      inventoryItems,
      resPerPage,
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

// Get single inventory item details => /api/v1/inventory/:id
const getInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    res.status(200).json({
      success: true,
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

// Update inventory item => /api/v1/inventory/:id
const updateInventoryItem = async (req, res, next) => {
  try {
    const id = req.params.id;

    let inventoryItem = await Inventory.findById(id);
    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    // Update the inventory item with new data from the request body
    inventoryItem = await Inventory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      inventoryItem,
    });
  } catch (error) {
    next(error);
  }
};


  // try {
  //   let inventoryItem = await Inventory.findById(req.params.id);

  //   if (!inventoryItem) {
  //     return next(new ErrorHandler('Inventory item not found', 404));
  //   }

  //   inventoryItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //     runValidators: true
  //   });

  //   res.status(200).json({
  //     success: true,
  //     inventoryItem
  //   });
  // } catch (error) {
  //   next(error);
  // }

// Delete inventory item => /api/v1/inventory/:id
const deleteInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    await inventoryItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inventory item is deleted'
    });
  } catch (error) {
    next(error);
  }
};

// Get low stock items => /api/v1/inventory/low-stock
const getLowStockItems = async (req, res, next) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ['$quantity', '$minStockLevel'] }
    });

    res.status(200).json({
      success: true,
      count: lowStockItems.length,
      lowStockItems
    });
  } catch (error) {
    next(error);
  }
};

// Borrow inventory item => /api/v1/inventory/:id/borrow
const borrowInventoryItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const userId = req.user._id; // Assuming you have user authentication

    if (!quantity || quantity <= 0) {
      return next(new ErrorHandler('Please enter a valid quantity', 400));
    }

    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    if (inventoryItem.availableQuantity < quantity) {
      return next(new ErrorHandler('Not enough items available', 400));
    }

    // Update available quantity
    inventoryItem.availableQuantity -= quantity;
    
    // Add to borrow history
    inventoryItem.borrowHistory.push({
      user: userId,
      quantity,
      status: 'borrowed'
    });

    await inventoryItem.save();

    res.status(200).json({
      success: true,
      message: 'Item borrowed successfully',
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

// Return inventory item => /api/v1/inventory/:id/return
const returnInventoryItem = async (req, res, next) => {
  try {
    const { borrowId, quantity } = req.body;
    const userId = req.user._id;

    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    const borrowRecord = inventoryItem.borrowHistory.id(borrowId);
    if (!borrowRecord) {
      return next(new ErrorHandler('Borrow record not found', 404));
    }

    if (borrowRecord.user.toString() !== userId.toString()) {
      return next(new ErrorHandler('You cannot return this item', 403));
    }

    if (borrowRecord.status === 'returned') {
      return next(new ErrorHandler('Item already returned', 400));
    }

    // Update available quantity
    inventoryItem.availableQuantity += quantity || borrowRecord.quantity;
    
    // Update borrow record
    borrowRecord.status = 'returned';
    borrowRecord.returnedAt = Date.now();
    if (quantity && quantity < borrowRecord.quantity) {
      borrowRecord.quantity = quantity;
    }

    await inventoryItem.save();

    res.status(200).json({
      success: true,
      message: 'Item returned successfully',
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

// Get borrow history for an item => /api/v1/inventory/:id/borrow-history
const getBorrowHistory = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id)
      .populate('borrowHistory.user', 'name email'); // Populate user details

    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    res.status(200).json({
      success: true,
      borrowHistory: inventoryItem.borrowHistory
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  borrowInventoryItem,
  returnInventoryItem,
  getBorrowHistory
};