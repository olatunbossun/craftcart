const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  images: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  // Sale-related fields
  currentSale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale'
  },
  salePrice: {
    type: Number,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  isOnSale: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add text index for search
productSchema.index({
  name: 'text',
  description: 'text'
});

// Index for sale-related queries
productSchema.index({ isOnSale: 1, salePrice: 1 });
productSchema.index({ currentSale: 1 });

// Virtual for getting the effective price (sale price if available, otherwise regular price)
productSchema.virtual('effectivePrice').get(function() {
  return this.isOnSale && this.salePrice ? this.salePrice : this.price;
});

// Virtual for getting discount amount
productSchema.virtual('discountAmount').get(function() {
  if (!this.isOnSale || !this.salePrice) return 0;
  return this.price - this.salePrice;
});

// Method to check if product has an active sale
productSchema.methods.hasActiveSale = function() {
  return this.isOnSale && this.currentSale && this.salePrice;
};

// Method to get the best price (lowest between regular and sale price)
productSchema.methods.getBestPrice = function() {
  return this.hasActiveSale() ? this.salePrice : this.price;
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);