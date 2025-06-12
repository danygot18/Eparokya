const Inventory = require('../models/Inventory.js');
const ErrorHandler = require('../helpers/error-handler.js');
const User = require("../models/user");
const sendEmail = require('../utils/sendEmail');


// Create new inventory item
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

// Get all inventory items
const getAllInventoryItems = async (req, res, next) => {
  try {
    const resPerPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const query = {};

    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const inventoryCount = await Inventory.countDocuments(query);

    const inventoryItems = await Inventory.find(query)
      .populate('borrowHistory.user', 'name email')
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

// Get single inventory item details 
const getInventoryItem = async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id)
      .populate('borrowHistory.user', 'name email');

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

// Update inventory item 
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

// Delete inventory item 
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

// Get low stock items 
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

// Borrow inventory item 
// const borrowInventoryItem = async (req, res, next) => {
//   try {
//     const { quantity } = req.body;
//     const userId = req.user._id; // Assuming you have user authentication

//     if (!quantity || quantity <= 0) {
//       return next(new ErrorHandler('Please enter a valid quantity', 400));
//     }

//     const inventoryItem = await Inventory.findById(req.params.id);
//     if (!inventoryItem) {
//       return next(new ErrorHandler('Inventory item not found', 404));
//     }

//     if (inventoryItem.availableQuantity < quantity) {
//       return next(new ErrorHandler('Not enough items available', 400));
//     }

//     // Update available quantity
//     inventoryItem.availableQuantity -= quantity;

//     // Add to borrow history
//     inventoryItem.borrowHistory.push({
//       user: userId,
//       quantity,
//       status: 'borrowed'
//     });

//     await inventoryItem.save();

//     res.status(200).json({
//       success: true,
//       message: 'Item borrowed successfully',
//       inventoryItem
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// updated
const borrowInventoryItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity <= 0) {
      return next(new ErrorHandler('Please enter a valid quantity', 400));
    }

    const user = await User.findById(userId);

    const hasAllowedRole = user.ministryRoles.some(role =>
      ['Coordinator', 'Assistant Coordinator'].includes(role.role)
    );

    if (!hasAllowedRole) {
      return next(new ErrorHandler('Only Coordinators or Assistant Coordinators can request to borrow items.', 403));
    }

    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    if (inventoryItem.availableQuantity < quantity) {
      return next(new ErrorHandler('Not enough items available', 400));
    }
    const adminEmail = "eparokyasys@gmail.com";
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f0f0f0; color: #333;">
        <p style="font-size: 16px;">Hello Admin,</p>

        <p style="font-size: 16px;">
          A new inventory borrow request has been submitted by <strong>${req.user.name}</strong> (${req.user.email}).
        </p>

        <h3 style="margin-top: 20px;">Borrow Request Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Item:</strong> ${inventoryItem.name}</li>
          <li><strong>Category:</strong> ${inventoryItem.category}</li>
          <li><strong>Quantity Requested:</strong> ${quantity} ${inventoryItem.unit}</li>
          <li><strong>Date Requested:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>

        <p style="margin-top: 20px;">
          Please log in to the <strong>E:Parokya</strong> admin panel to review and take action.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
        <footer style="font-size: 14px; color: #777;">
          <p><strong>E:Parokya</strong><br>
          Saint Joseph Parish – Taguig<br>
          This is an automated email. Do not reply.</p>
        </footer>
      </div>
    `;

    await sendEmail({
      email: adminEmail,
      subject: "New Borrow Request Submitted",
      message: htmlMessage,
    });

    inventoryItem.borrowHistory.push({
      user: userId,
      quantity,
      status: 'pending', 
      requestedAt: Date.now()
    });

    await inventoryItem.save();

    res.status(200).json({
      success: true,
      message: 'Borrow request submitted and is pending admin approval.',
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

// Return inventory item 
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

// Get borrow history for an item 
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



// Accept a borrow request
const acceptBorrowRequest = async (req, res, next) => {
  try {
    const { borrowId } = req.body;
    const inventoryItem = await Inventory.findById(req.params.id).populate('borrowHistory.user'); 

    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    const borrowRecord = inventoryItem.borrowHistory.id(borrowId);
    if (!borrowRecord) {
      return next(new ErrorHandler('Borrow record not found', 404));
    }

    if (borrowRecord.status !== 'pending') {
      return next(new ErrorHandler('Borrow request is not pending', 400));
    }

    if (inventoryItem.availableQuantity < borrowRecord.quantity) {
      return next(new ErrorHandler('Not enough items available to approve this request', 400));
    }

    borrowRecord.status = 'borrowed';
    borrowRecord.borrowedAt = new Date();
    inventoryItem.availableQuantity -= borrowRecord.quantity;

    await inventoryItem.save();

    const user = borrowRecord.user;
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f0f0f0; color: #333;">
        <p style="font-size: 16px;">Good day, ${user.fullname}!</p>

        <p style="font-size: 16px;">
          Your request to borrow the following inventory item has been <strong>approved</strong>:
        </p>

        <ul style="list-style: none; padding: 0;">
          <li><strong>Item:</strong> ${inventoryItem.name}</li>
          <li><strong>Category:</strong> ${inventoryItem.category}</li>
          <li><strong>Quantity Approved:</strong> ${borrowRecord.quantity} ${inventoryItem.unit}</li>
          <li><strong>Date Approved:</strong> ${new Date(borrowRecord.borrowedAt).toLocaleDateString()}</li>
        </ul>

        <p style="margin-top: 20px;">Please proceed to the office or contact the admin (0969 218 3484) if you have questions.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
        <footer style="font-size: 14px; color: #777;">
          <p><strong>E:Parokya</strong><br>
          Saint Joseph Parish – Taguig<br>
          This is an automated email. Do not reply.</p>
        </footer>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Borrow Request Approved – E:Parokya Admin Inventory",
      message: htmlMessage,
    });

    res.status(200).json({
      success: true,
      message: 'Borrow request approved and user notified via email.',
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};


// Reject a borrow request
const rejectBorrowRequest = async (req, res, next) => {
  try {
    const { borrowId, reason } = req.body;
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return next(new ErrorHandler('Inventory item not found', 404));
    }

    const borrowRecord = inventoryItem.borrowHistory.id(borrowId);
    if (!borrowRecord) {
      return next(new ErrorHandler('Borrow record not found', 404));
    }

    if (borrowRecord.status !== 'pending') {
      return next(new ErrorHandler('Borrow request is not pending', 400));
    }

    borrowRecord.status = 'rejected';
    borrowRecord.rejectedAt = new Date();
    borrowRecord.rejectionReason = reason || '';

    await inventoryItem.save();

    res.status(200).json({
      success: true,
      message: 'Borrow request rejected successfully',
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

// respond 
const respondToBorrowRequest = async (req, res, next) => {
  try {
    const { borrowId, action, reason } = req.body;
    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) return next(new ErrorHandler('Item not found', 404));

    const borrowRecord = inventoryItem.borrowHistory.id(borrowId);
    if (!borrowRecord) return next(new ErrorHandler('Borrow request not found', 404));

    if (borrowRecord.status !== 'pending') {
      return next(new ErrorHandler('Request already processed.', 400));
    }

    if (action === 'accept') {
      borrowRecord.status = 'borrowed';
      borrowRecord.borrowedAt = Date.now();
      inventoryItem.availableQuantity -= borrowRecord.quantity;
    } else if (action === 'reject') {
      borrowRecord.status = 'rejected';
      if (reason) borrowRecord.rejectionReason = reason;
    } else {
      return next(new ErrorHandler('Invalid action', 400));
    }

    await inventoryItem.save();

    res.status(200).json({
      success: true,
      message: `Request ${action}ed successfully`,
      inventoryItem
    });
  } catch (error) {
    next(error);
  }
};

// Get all pending borrow requests across all inventory items
const getAllPendingBorrows = async (req, res, next) => {
  try {
    const items = await Inventory.find({ "borrowHistory.status": "pending" })
      .populate("borrowHistory.user", "name email")
      .lean();

    const pendingBorrows = [];
    items.forEach(item => {
      item.borrowHistory.forEach(record => {
        if (record.status === "pending") {
          pendingBorrows.push({
            ...record,
            itemId: item._id,
            itemName: item.name,
            itemUnit: item.unit,
            itemAvailable: item.availableQuantity,
            itemCategory: item.category,
          });
        }
      });
    });

    res.status(200).json({ success: true, pendingBorrows });
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
  getBorrowHistory,
  acceptBorrowRequest,
  rejectBorrowRequest,
  respondToBorrowRequest,
  getAllPendingBorrows,
};