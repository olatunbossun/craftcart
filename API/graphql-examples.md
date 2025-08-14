# GraphQL Product Sorting Examples

## New Queries Added

### 1. Enhanced `products` query with sorting
```graphql
query GetProductsSortedByPrice($filter: ProductFilter!) {
  products(filter: $filter) {
    id
    name
    description
    price
    quantity
    images
    category {
      id
      name
    }
    artisan {
      id
      name
    }
    createdAt
  }
}
```

**Variables:**
```json
{
  "filter": {
    "sortByPrice": "ASC",
    "minPrice": 10,
    "maxPrice": 100,
    "categoryId": "category_id_here"
  }
}
```

### 2. Dedicated `productsByPrice` query
```graphql
query GetProductsByPrice($sortOrder: SortOrder!, $limit: Int) {
  productsByPrice(sortOrder: $sortOrder, limit: $limit) {
    id
    name
    description
    price
    quantity
    images
    category {
      id
      name
    }
    artisan {
      id
      name
    }
    createdAt
  }
}
```

**Variables:**
```json
{
  "sortOrder": "DESC",
  "limit": 20
}
```

## Available Sort Options

- `ASC` - Sort by price in ascending order (lowest to highest)
- `DESC` - Sort by price in descending order (highest to lowest)

## Usage Examples

### Get all products sorted by price (lowest first)
```graphql
query {
  products(filter: { sortByPrice: ASC }) {
    id
    name
    price
  }
}
```

### Get products in a specific price range, sorted by price (highest first)
```graphql
query {
  products(filter: { 
    minPrice: 50, 
    maxPrice: 200, 
    sortByPrice: DESC 
  }) {
    id
    name
    price
    category {
      name
    }
  }
}
```

### Get top 10 most expensive products
```graphql
query {
  productsByPrice(sortOrder: DESC, limit: 10) {
    id
    name
    price
    artisan {
      name
    }
  }
}
```

### Get cheapest products in a category
```graphql
query {
  products(filter: { 
    categoryId: "category_id_here", 
    sortByPrice: ASC 
  }) {
    id
    name
    price
    category {
      name
    }
  }
}
```

## Notes

- The `sortByPrice` parameter is optional in the `products` query
- If no sorting is specified, products will be returned in their default order
- The `productsByPrice` query always sorts by price and is useful when you specifically want price-sorted results
- Both queries support all existing filtering options (category, artisan, price range, search)
- Sorting is applied before population of related fields for optimal performance 