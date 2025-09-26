const express = require('express');
const {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} = require('../../controllers/contact-controllers/contact.controller');
const { contactSchema } = require('../../schemas/contact.schemas');
const { validate } = require('../../middlewares/validateRequest');
const { requireAuth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', requireAuth, getContacts);
router.post('/add', requireAuth, validate(contactSchema), addContact);
router.put('/update/:id', requireAuth, updateContact);
router.delete('/delete/:id', requireAuth, deleteContact);

module.exports = router;
