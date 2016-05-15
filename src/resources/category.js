const Resource = require('./resource');
const CategoryModel = require('../models/category').model;

class Category extends Resource {

  constructor() {
    super();

    this._name = null;
    this._description = null;
    this._image = null;
    this._position = 0;
    this._parent = null;
  }


  /**
   * Saves this category
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string}   name        Name of the category
   * @param  {string}   description Description of the category
   * @param  {string}   image       Image for the category
   * @param  {[integer} position    Position for sorting
   * @param  {Category} parent      Reference to parent cateogory (null if root)
   */
  save(
    name,
    description = '',
    image = null,
    position = 0,
    parent = null
  ) {
    const c = new CategoryModel({
      name: name,
      description: description,
      image: image,
      position: position,
      parent: parent,
    });

    // TODO: Set the last pieces of information in this object (created_at etc)

    return c.save();
  }


  /**
   * Getters and setters
   */

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

}

module.exports = Category;
