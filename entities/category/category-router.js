const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const CategoryCollection = require('./category-collection');
const Category = require('./category-resource');


/**
 * Get categories
 */
const getAll = async((req, res) => {
  const cc = new CategoryCollection();

  try {
    const categories = await(cc.getAll());
    res.status(200).json(categories);
  } catch (e) {
    res.status(400).json({
      error: {
        message: 'Could not fetch categories',
      },
    });
  }
});


/**
 * Add new category
 * @author Johan Kanefur <johan.canefur@gmail.com>
 * @todo Add middleware for userlevel
 */
const create = async((req, res) => {
  try {
    const c = new Category(this.body.name);
    await(c.save());

    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({
      error: {
        message: e.message,
      },
    });
  }
});

// router.get('/', getAll);
// router.post('/', create);

module.exports = router;
