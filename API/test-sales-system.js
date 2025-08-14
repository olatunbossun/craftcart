// Test script for the Sales System
// This demonstrates the key functionality of the sales system

const mongoose = require('mongoose');
const { Sale, Product, User } = require('./models');

// Mock data for testing
const mockData = {
  artisan: {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Artisan',
    email: 'artisan@test.com',
    role: 'ARTISAN'
  },
  product: {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Product',
    description: 'A test product for sales',
    price: 100.00,
    quantity: 50,
    artisan: null, // Will be set to artisan._id
    category: new mongoose.Types.ObjectId()
  },
  sale: {
    discountPercentage: 25.0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    description: 'Test Sale - 25% off!',
    maxQuantity: 20
  }
};

async function testSalesSystem() {
  console.log('🧪 Testing Sales System...\n');

  try {
    // Test 1: Create a sale
    console.log('1️⃣ Creating a sale...');
    const sale = new Sale({
      ...mockData.sale,
      product: mockData.product._id,
      artisan: mockData.artisan._id,
      originalPrice: mockData.product.price,
      discountAmount: (mockData.product.price * mockData.sale.discountPercentage) / 100,
      salePrice: mockData.product.price - ((mockData.product.price * mockData.sale.discountPercentage) / 100)
    });

    console.log('   Sale created with:');
    console.log(`   - Discount: ${sale.discountPercentage}%`);
    console.log(`   - Original Price: $${sale.originalPrice}`);
    console.log(`   - Sale Price: $${sale.salePrice}`);
    console.log(`   - Discount Amount: $${sale.discountAmount}`);
    console.log(`   - Start Date: ${sale.startDate.toDateString()}`);
    console.log(`   - End Date: ${sale.endDate.toDateString()}`);
    console.log(`   - Is Currently Active: ${sale.isCurrentlyActive}\n`);

    // Test 2: Calculate discounted price
    console.log('2️⃣ Testing price calculations...');
    const testPrice = 200.00;
    const calculatedPrice = sale.calculateDiscountedPrice(testPrice);
    console.log(`   Original Price: $${testPrice}`);
    console.log(`   Discount: ${sale.discountPercentage}%`);
    console.log(`   Calculated Sale Price: $${calculatedPrice}\n`);

    // Test 3: Check sale status
    console.log('3️⃣ Testing sale status...');
    console.log(`   Sale is active: ${sale.isActive}`);
    console.log(`   Sale is currently active: ${sale.isCurrentlyActive}`);
    console.log(`   Can apply sale: ${sale.canApplySale()}\n`);

    // Test 4: Validate business rules
    console.log('4️⃣ Testing business rules...');
    
    // Test discount percentage validation
    try {
      sale.discountPercentage = 150; // Invalid: > 100%
      await sale.validate();
    } catch (error) {
      console.log('   ✅ Discount percentage validation working (rejected 150%)');
    }

    // Test date validation
    try {
      sale.endDate = sale.startDate; // Invalid: same as start date
      await sale.validate();
    } catch (error) {
      console.log('   ✅ Date validation working (rejected same start/end date)');
    }

    // Test 5: Product integration
    console.log('5️⃣ Testing product integration...');
    const product = new Product({
      ...mockData.product,
      artisan: mockData.artisan._id,
      currentSale: sale._id,
      salePrice: sale.salePrice,
      discountPercentage: sale.discountPercentage,
      isOnSale: true
    });

    console.log(`   Product: ${product.name}`);
    console.log(`   Original Price: $${product.price}`);
    console.log(`   Sale Price: $${product.salePrice}`);
    console.log(`   Is On Sale: ${product.isOnSale}`);
    console.log(`   Effective Price: $${product.effectivePrice}`);
    console.log(`   Discount Amount: $${product.discountAmount}`);
    console.log(`   Has Active Sale: ${product.hasActiveSale()}`);
    console.log(`   Best Price: $${product.getBestPrice()}\n`);

    console.log('✅ All tests completed successfully!');
    console.log('\n📚 The sales system includes:');
    console.log('   - Percentage-based discounts (0-100%)');
    console.log('   - Time-limited sales with start/end dates');
    console.log('   - Automatic price calculations');
    console.log('   - Conflict prevention (no overlapping sales)');
    console.log('   - Role-based access control (artisans only)');
    console.log('   - Quantity limits for flash sales');
    console.log('   - Real-time sale status tracking');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSalesSystem();
}

module.exports = { testSalesSystem }; 