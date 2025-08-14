# Sales and Discount System Documentation

## Overview

The sales system allows artisans to create time-limited discounts on their products. Artisans can set discount percentages, define sale periods, and manage active sales for their products.

## Features

- **Percentage-based discounts** (0-100%)
- **Time-limited sales** with start and end dates
- **Quantity limits** for flash sales
- **Automatic price calculations**
- **Sale validation** to prevent conflicts
- **Role-based access control** (artisans only)

## Data Models

### Sale Model
```javascript
{
  id: ID!
  product: Product!           // Reference to the product
  artisan: User!             // Reference to the artisan
  discountPercentage: Float! // Discount percentage (0-100)
  discountAmount: Float!     // Calculated discount amount
  originalPrice: Float!      // Original product price
  salePrice: Float!          // Final sale price
  startDate: Date!           // Sale start date
  endDate: Date!             // Sale end date
  isActive: Boolean!         // Whether sale is active
  isCurrentlyActive: Boolean! // Virtual field for current status
  description: String        // Sale description
  maxQuantity: Int          // Maximum quantity for sale (optional)
  soldQuantity: Int!        // Current sold quantity
  createdAt: Date!
  updatedAt: Date!
}
```

### Updated Product Model
```javascript
{
  // ... existing fields ...
  currentSale: Sale         // Reference to active sale
  salePrice: Float          // Current sale price
  discountPercentage: Float // Current discount percentage
  isOnSale: Boolean!        // Whether product is currently on sale
  effectivePrice: Float!    // Virtual field for best price
  discountAmount: Float!    // Virtual field for discount amount
}
```

## GraphQL Queries

### 1. Get All Sales
```graphql
query GetSales($filter: SaleFilter) {
  sales(filter: $filter) {
    id
    product {
      id
      name
      price
    }
    artisan {
      id
      name
    }
    discountPercentage
    salePrice
    startDate
    endDate
    isActive
    isCurrentlyActive
    description
  }
}
```

**Filter Options:**
- `productId`: Filter by specific product
- `artisanId`: Filter by specific artisan
- `isActive`: Filter by active status
- `startDate`/`endDate`: Filter by date range
- `minDiscountPercentage`/`maxDiscountPercentage`: Filter by discount range

### 2. Get Active Sales
```graphql
query GetActiveSales {
  activeSales {
    id
    product {
      id
      name
      price
    }
    discountPercentage
    salePrice
    endDate
    description
  }
}
```

### 3. Get Products on Sale
```graphql
query GetProductsOnSale($limit: Int) {
  productsOnSale(limit: $limit) {
    id
    name
    price
    salePrice
    discountPercentage
    discountAmount
    effectivePrice
    currentSale {
      startDate
      endDate
      description
    }
  }
}
```

### 4. Get Products with Sale Filtering
```graphql
query GetProducts($filter: ProductFilter) {
  products(filter: $filter) {
    id
    name
    price
    salePrice
    isOnSale
    effectivePrice
    discountPercentage
    currentSale {
      startDate
      endDate
      description
    }
  }
}
```

**Filter Options:**
- `onSale: true` - Only products currently on sale
- `onSale: false` - Only products not on sale
- All existing filters (category, price range, search, etc.)

## GraphQL Mutations

### 1. Create Sale
```graphql
mutation CreateSale($input: CreateSaleInput!) {
  createSale(input: $input) {
    id
    product {
      id
      name
      price
    }
    discountPercentage
    salePrice
    startDate
    endDate
    description
  }
}
```

**Input:**
```json
{
  "input": {
    "productId": "product_id_here",
    "discountPercentage": 25.0,
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "description": "Holiday Sale - 25% off!",
    "maxQuantity": 100
  }
}
```

### 2. Update Sale
```graphql
mutation UpdateSale($id: ID!, $input: UpdateSaleInput!) {
  updateSale(id: $id, input: $input) {
    id
    discountPercentage
    salePrice
    startDate
    endDate
    description
  }
}
```

### 3. Activate/Deactivate Sale
```graphql
mutation ActivateSale($id: ID!) {
  activateSale(id: $id) {
    id
    isActive
    product {
      isOnSale
      salePrice
    }
  }
}

mutation DeactivateSale($id: ID!) {
  deactivateSale(id: $id) {
    id
    isActive
    product {
      isOnSale
      salePrice
    }
  }
}
```

### 4. Delete Sale
```graphql
mutation DeleteSale($id: ID!) {
  deleteSale(id: $id)
}
```

## Business Rules

### Sale Creation
1. **Artisan Only**: Only users with `ARTISAN` role can create sales
2. **Own Products**: Artisans can only create sales for their own products
3. **Date Validation**: End date must be after start date, start date cannot be in the past
4. **Discount Range**: Discount percentage must be between 0-100%
5. **No Conflicts**: Cannot create overlapping sales for the same product

### Sale Management
1. **Automatic Calculations**: Sale price and discount amount are calculated automatically
2. **Product Updates**: Product is automatically updated with sale information
3. **Conflict Prevention**: System prevents multiple active sales for the same product
4. **Quantity Tracking**: Optional quantity limits for flash sales

### Sale Expiration
1. **Automatic Status**: Sales automatically become inactive after end date
2. **Product Cleanup**: Product sale information is removed when sale ends
3. **Real-time Updates**: `isCurrentlyActive` field provides real-time status

## Usage Examples

### Create a 30% off sale for a week
```graphql
mutation {
  createSale(input: {
    productId: "product123",
    discountPercentage: 30.0,
    startDate: "2024-01-20T00:00:00Z",
    endDate: "2024-01-27T23:59:59Z",
    description: "Week-long sale - 30% off!"
  }) {
    id
    salePrice
    discountAmount
  }
}
```

### Get all products currently on sale
```graphql
query {
  products(filter: { onSale: true }) {
    id
    name
    price
    salePrice
    discountPercentage
    effectivePrice
  }
}
```

### Get artisan's active sales
```graphql
query {
  artisanSales(artisanId: "artisan123") {
    id
    product {
      name
      price
    }
    discountPercentage
    salePrice
    endDate
    isCurrentlyActive
  }
}
```

## Error Handling

The system provides comprehensive error handling:

- **AuthenticationError**: User not logged in
- **ForbiddenError**: User doesn't have permission
- **UserInputError**: Invalid input data (dates, percentages, etc.)
- **Validation Errors**: Mongoose validation errors

## Performance Considerations

- **Indexed Fields**: Database indexes on frequently queried fields
- **Efficient Queries**: Optimized MongoDB queries with proper population
- **Virtual Fields**: Computed fields for better performance
- **Batch Updates**: Efficient product updates when sales change

## Security Features

- **Role-based Access**: Only artisans can manage sales
- **Ownership Validation**: Users can only modify their own sales
- **Input Validation**: Comprehensive validation of all inputs
- **Date Sanitization**: Proper date handling and validation 