const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

// Models
const Customer = require('./customer-model');
const Authentication = require('../session/authentication');

// Error handling and logging
const Oops = require('../../lib/oops');
const applog = require('winston').loggers.get('applog');

// Middleware
const authMiddleware = require('../../server/middleware/authentication');

// Helpers
const userRoles = require('../user/user-roles');
const config = require('../../config/main');
const emailer = require('../../email');

/**
 * Gets the customer, this is limited to the authenticated user and the
 * admin only, meaning that customers cannot view each others profiles
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const getCustomer = async((req, res) => {
  const isAdmin = req.user.role === userRoles.ROLES.ADMIN;

  // Admin and the customer himself have access to this resource
  if (!(isAdmin || req.user.id === req.params.custid)) {
    return res.oops(new Oops('No permission to this resource', 403, 5000));
  }

  let customer = null;

  try {
    customer = await(Customer.findById(req.params.custid));
  } catch (err) {
    return res.oops(new Oops('Could not find customer', 500, 5000, err));
  }

  if (!customer) {
    return res.oops(new Oops('Could not find customer', 404, 5000));
  }

  // The customer is found, return it
  const responseData = {
    data: {
      type: 'customer',
      attributes: {
        name: customer.name,
        email: customer.email,
        addresses: customer.addresses
      },
      relationships: {
        orders: customer.orders.map(order => {
          return {
            data: {
              type: 'order',
              id: order.id
            }
          };
        })
      }
    }
  };

  res.status(200).reply(responseData);
});

/**
 * Creates a customer account (acts like a registration)
 * @author Johan Kanefur <johan.canefur@gmail.com>
 */
const createCustomer = async((req, res) => {
  // Read input parameters
  let email = null;
  let username = null;
  let password = null;
  let firstname = null;
  let lastname = null;
  const role = config.customer.accountConfirmation ?
    userRoles.ROLES.INACTIVE : userRoles.ROLES.USER;

  try {
    username = req.body.data.attributes.username || null;
    email = req.body.data.attributes.email;
    password = req.body.data.attributes.password;
    firstname = req.body.data.attributes.firstname;
    lastname = req.body.data.attributes.lastname;
  } catch (err) {
    return res.oops(new Oops('Required parameters missing', 400, 4001, err));
  }

  // Hash the password
  let hash = null;

  try {
    hash = await(Authentication.generateHash(password));
  } catch (e) {
    return res.oops(new Oops('Could not generate password hash', 500, 5000, e));
  }

  const customer = new Customer({
    email: email,
    username: username,
    role: role,
    firstname: firstname,
    lastname: lastname,
    password: hash,
  });

  // Save the new customer
  try {
    await(customer.save());
  } catch (err) {
    return res.oops(new Oops('Could not save new customer', 500, 5000, err));
  }

  // Only send email if account confirmation is activated
  if (config.customer.accountConfirmation) {
    try {
      // Run the mailing async
      emailer.sendCustomerActivationEmail(customer).then(json => {
        applog.info(`Sent mail to ${customer.email} successfully`, json);
      });
    } catch (err) {
      applog.error('Error sending customer activation mail', err);
    }
  }

  // Write response
  return res.status(201).reply({
    data: {
      type: 'customer',
      id: customer.id,
      attributes: {
        email: customer.email,
        username: customer.username,
        firstname: customer.firstname,
        lastname: customer.lastname,
        role: customer.role,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
    },
  });
});


// Hook up route methods
router.get('/:custid', authMiddleware.authenticated, getCustomer);
router.post('/', createCustomer);

module.exports = {
  router: router,
  getCustomer: getCustomer,
  createCustomer: createCustomer,
};
