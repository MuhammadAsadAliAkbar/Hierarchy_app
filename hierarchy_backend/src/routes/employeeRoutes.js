const express = require('express');
const {
  getEmployees,
  getTree,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/tree', getTree);
router.get('/stats', getStats);
router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').get(getEmployee).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
