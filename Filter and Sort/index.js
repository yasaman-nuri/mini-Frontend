const products = [
  { id: 1, name: "Apple iPhone 12", category: "Electronics", price: 999 },
  { id: 2, name: "Adidas running shoes", category: "Sportswear", price: 280 },
  { id: 3, name: "Samsung Galaxy S21", category: "Electronics", price: 850 },
  { id: 4, name: "Nike Air Max", category: "Sportswear", price: 300 },
];

const criteria = {
  categories: ["Electronics", "Sportswear"],
  priceRange: { min: 200, max: 1000 },
  nameLength: { min: 10, max: 25 },
  keywords: ["Galaxy", "Air"],
  sortBy: [
    { field: "price", order: "ascending" },
    { field: "name", order: "descending" },
  ],
};

function filterAndSortProducts(products, criteria) {
  // Filter products
  let filteredProducts = products.filter((product) => {
    return (
      filterByCategories(product, criteria.categories) &&
      filterByPrice(
        product,
        criteria.priceRange?.min,
        criteria.priceRange?.max
      ) &&
      filterByLength(
        product,
        criteria.nameLength?.min,
        criteria.nameLength?.max
      ) &&
      filterByKeywords(product, criteria.keywords)
    );
  });

  // Sort products if sortBy exists
  if (criteria.sortBy && criteria.sortBy.length > 0) {
    filteredProducts = sortData(filteredProducts, criteria.sortBy);
  }

  return filteredProducts;
}

// Filter helper functions
const filterByCategories = (product, categories) => {
  if (!categories || categories.length === 0) return true;
  return categories.includes(product.category);
};

const filterByPrice = (product, min, max) => {
  return (!min || product.price >= min) && (!max || product.price <= max);
};

const filterByLength = (product, min, max) => {
  return (
    (!min || product.name.length >= min) && (!max || product.name.length <= max)
  );
};

const filterByKeywords = (product, keywords) => {
  if (!keywords || keywords.length === 0) return true;
  return keywords.some((keyword) =>
    product.name.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Sorting function
const sortData = (data, sortBy) => {
  return data.sort((a, b) => {
    for (const sortOption of sortBy) {
      //The function loops through each sort option in sortBy
      const { field, order } = sortOption; //Extracts the field and order to sort by
      let comparison = 0;

      if (field === "price") {
        comparison = a.price - b.price; //Returns negative if a is cheaper, positive if b is cheaper
      } else if (field === "name") {
        comparison = a.name.localeCompare(b.name); //Returns -1, 0, or 1 based on alphabetical order
      }

      if (order === "descending") {
        //If order is 'descending', it negates the comparison result.
        comparison = -comparison; //This reverses the sort order while using the same comparison logic
      }

      if (comparison !== 0) {
        return comparison; //If comparison is 0 (equal), it moves to the next sort criterion
        //If all comparisons are 0, it returns 0 (elements stay in current order)
      }
    }
    return 0;
  });
};

// Test the function
console.log(filterAndSortProducts(products, criteria));

module.exports = { filterAndSortProducts };



/*Key Points to Remember

The comparison function must return:

Negative number if a should come before b

Positive number if b should come before a

Zero if they're equal

Multi-criteria sorting works by:

Only moving to the next sort criterion if current comparison is 0

This creates a hierarchy of sort priorities

Negating the comparison is how descending order is achieved:

a - b gives ascending order

-(a - b) or b - a gives descending order*/