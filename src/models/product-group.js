const mongoose = require('mongoose');

/**
 * General product group model
 */

const ProductGroup = {
  name: '',     // Collection name
  products: [], // Associated products / physical products
};

/**
 * Get all options for a product group by comparing the differences (divide the
 * objects)
 *
 *
 *
 *
 * Mindset:
 * - Big but few queries
 * - Load too much, filter out on request (from cache ofc)
 * -
 */
