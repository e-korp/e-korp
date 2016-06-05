const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const Category = require('./category-model');

// Error handling and logging
const Oops = require('../../lib/oops');
// const applog = require('winston').loggers.get('applog');

// Middleware
const authMiddleware = require('../../server/middleware/authentication');

/**
 * Create a new category
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const create = async((req, res) => {
  const cat = new Category();

  try {
    cat.name = req.body.data.attributes.name;
    cat.description = req.body.data.attributes.description || null;
    cat.position = req.body.data.attributes.position || 0;
  } catch (err) {
    return res.oops(new Oops('Required parameters missing', 400, 5001, err));
  }

  try {
    await(cat.save());
  } catch (err) {
    return res.oops(new Oops('Could not save category', 500, 5000, err));
  }

  res.status(201).reply({
    data: {
      type: 'category',
      id: cat.id,
      attributes: {
        name: cat.name,
        description: cat.description,
        position: cat.position
      }
    }
  });
});


/**
 * Clears the parent relationship for a category
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const clearParentRelationship = async((req, res) => {
  let child = null;

  try {
    child = await(Category.findById(req.params.id));
  } catch (err) {
    return res.oops(new Oops('Could not find category', 404, 5000, err));
  }

  // Clear the parent
  child.parent = null;

  try {
    await(child.save());
  } catch (err) {
    return res.oops(new Oops('Could not save category', 500, 5000, err));
  }

  // No body required
  res.status(204).send();
});


/**
 * Add or remove a parent to this category
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const patchParentRel = async((req, res) => {
  const id = req.params.id;

  if (typeof req.body.data === 'undefined') {
    return res.oops(new Oops('Required parameters missing', 400, 5000));
  }

  // Check if the user wants to clear this relationship
  if (req.body.data === null) {
    return clearParentRelationship(req, res);
  }

  // Get the ID of the parent
  const parentId = req.body.data.id || null;

  if (parentId === null) {
    return res.oops(new Oops('Required parameters missing', 400, 5000));
  }

  // Fetch both the soon-to-be child and the parent
  let result = null;

  try {
    // Load the two async
    result = await({
      child: Category.findById(parentId),
      parent: Category.findById(id)
    });
  } catch (err) {
    return res.oops(
      new Oops('Could not find child or parent category', 404, 5001, err)
    );
  }

  const child = result.child;
  const parent = result.parent;

  // Check if both categories existed
  if (!child || !parent) {
    return res.oops(
      new Oops('Could not find child or parent category', 404, 5000)
    );
  }

  // Add the parent category as parent for the child
  child.parent = parent.id;

  // Try to save the child
  try {
    await(child.save());
  } catch (err) {
    return res.oops(new Oops('Could not save category', 500, 5000, err));
  }

  // No need to return a body
  res.status(201).send();
});

/**
 * Gets all categories that exists
 * @todo Provide performant example on how to construct a tree of this data
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const getAll = async((req, res) => {
  let categories = [];

  try {
    categories = await(Category.find({}).exec());
  } catch (err) {
    return res.oops(new Oops('Could not get categories', 500, 5000, err));
  }

  const responseData = categories.map(cat => {
    return {
      data: {
        type: 'category',
        id: cat.id,
        attributes: {
          name: cat.name,
          description: cat.description,
          position: cat.position
        },
        relationships: cat.parent ? {
          parent: {
            data: {
              type: 'category',
              id: cat.parent
            }
          }
        //  JSON.stringify will not include this attribute if its undefined
        } : undefined // eslint-disable-line
      }
    };
  });

  return res.status(200).reply(responseData);
});

/**
 * Delete a category
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const deleteCategory = async((req, res) => {
  let category = null;

  try {
    category = await(Category.findById(req.params.id));
  } catch (err) {
    return res.oops(new Oops('Could not find category', 500, 5000, err));
  }

  if (!category) {
    return res.oops(new Oops('Category did not exist', 404, 5000));
  }

  // Try to delete it
  let affected = 0;

  try {
    affected = await(category.remove());
  } catch (err) {
    return res.oops(new Oops('Could not delete category', 500, 5000, err));
  }

  if (affected === 0) {
    return res.oops(new Oops('No categories was affected', 500, 5000));
  }

  // No body is required
  res.status(204).send();
});

router.post('/', authMiddleware.admin, create);
router.patch('/:id/relationships/parent', authMiddleware.admin, patchParentRel);
router.get('/', getAll);
router.delete('/:id', authMiddleware.admin, deleteCategory);

module.exports = {
  router: router,
  create: create,
  patchParentRel: patchParentRel,
  getAll: getAll,
  deleteCategory: deleteCategory
};
