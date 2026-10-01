const Employee = require('../models/Employee');
const { ROLES } = require('../models/Employee');

// Allowed hierarchy: who can report to whom
const HIERARCHY_RULES = {
  CEO: [], // top level, no parent
  Manager: ['CEO'],
  'Project Manager': ['Manager', 'CEO'],
  'Team Lead': ['Project Manager', 'Manager'],
  Junior: ['Team Lead', 'Project Manager'],
  Associate: ['Team Lead', 'Project Manager'],
  Intern: ['Team Lead', 'Junior', 'Associate', 'Project Manager'],
};

// Build nested tree from flat list
function buildTree(employees, parentId = null) {
  return employees
    .filter((e) => {
      const p = e.parent?._id?.toString() || e.parent?.toString() || null;
      return p === (parentId ? parentId.toString() : null);
    })
    .map((e) => ({
      ...e.toObject ? e.toObject() : e,
      children: buildTree(employees, e._id),
    }));
}

// @desc Get all employees (flat)
exports.getEmployees = async (req, res, next) => {
  try {
    const { designation, department, status, search } = req.query;
    const query = {};
    if (designation) query.designation = designation;
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    const employees = await Employee.find(query)
      .populate('parent', 'name designation')
      .sort({ designation: 1, name: 1 });
    res.json({ success: true, data: employees, roles: ROLES });
  } catch (e) { next(e); }
};

// @desc Get hierarchy tree
exports.getTree = async (req, res, next) => {
  try {
    const employees = await Employee.find({ status: { $ne: 'inactive' } })
      .populate('parent', 'name designation')
      .lean();
    const tree = buildTree(employees);
    res.json({ success: true, data: tree });
  } catch (e) { next(e); }
};

// @desc Get single employee + direct reports
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('parent', 'name designation email')
      .populate('children');
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (e) { next(e); }
};

// @desc Create employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, phone, designation, department, parent, employeeId, joiningDate, salary, status } = req.body;

    // Hierarchy validation
    if (designation === 'CEO') {
      const existingCEO = await Employee.findOne({ designation: 'CEO' });
      if (existingCEO) {
        return res.status(400).json({ success: false, message: 'CEO already exists. Only one CEO allowed.' });
      }
      if (parent) {
        return res.status(400).json({ success: false, message: 'CEO cannot have a parent' });
      }
    } else {
      if (!parent) {
        return res.status(400).json({ success: false, message: `${designation} must have a reporting manager` });
      }
      const parentEmp = await Employee.findById(parent);
      if (!parentEmp) {
        return res.status(400).json({ success: false, message: 'Parent employee not found' });
      }
      const allowed = HIERARCHY_RULES[designation] || [];
      if (!allowed.includes(parentEmp.designation)) {
        return res.status(400).json({
          success: false,
          message: `${designation} can only report to: ${allowed.join(', ')}. Got: ${parentEmp.designation}`,
        });
      }
    }

    const emp = await Employee.create({
      name, email, phone, designation, department, parent: parent || null,
      employeeId, joiningDate, salary, status,
    });
    const populated = await Employee.findById(emp._id).populate('parent', 'name designation');
    res.status(201).json({ success: true, data: populated });
  } catch (e) { next(e); }
};

// @desc Update employee
exports.updateEmployee = async (req, res, next) => {
  try {
    let emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });

    const { designation, parent } = req.body;

    // Prevent circular reference
    if (parent) {
      if (parent === req.params.id) {
        return res.status(400).json({ success: false, message: 'Cannot report to self' });
      }
      // Check if parent is a descendant
      const isDescendant = async (id, targetId) => {
        const children = await Employee.find({ parent: id });
        for (const c of children) {
          if (c._id.toString() === targetId) return true;
          if (await isDescendant(c._id, targetId)) return true;
        }
        return false;
      };
      if (await isDescendant(req.params.id, parent)) {
        return res.status(400).json({ success: false, message: 'Cannot set a subordinate as parent (circular hierarchy)' });
      }
    }

    if (designation && designation !== emp.designation) {
      if (designation === 'CEO') {
        const existingCEO = await Employee.findOne({ designation: 'CEO', _id: { $ne: emp._id } });
        if (existingCEO) {
          return res.status(400).json({ success: false, message: 'CEO already exists' });
        }
      }
    }

    emp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('parent', 'name designation');

    res.json({ success: true, data: emp });
  } catch (e) { next(e); }
};

// @desc Delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Re-assign children to parent of deleted employee (or null)
    await Employee.updateMany(
      { parent: emp._id },
      { parent: emp.parent || null }
    );

    await emp.deleteOne();
    res.json({ success: true, message: 'Employee deleted. Subordinates reassigned.' });
  } catch (e) { next(e); }
};

// @desc Stats
exports.getStats = async (req, res, next) => {
  try {
    const total = await Employee.countDocuments();
    const byDesignation = await Employee.aggregate([
      { $group: { _id: '$designation', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byDept = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);
    const active = await Employee.countDocuments({ status: 'active' });
    res.json({
      success: true,
      data: { total, active, byDesignation, byDepartment: byDept, roles: ROLES },
    });
  } catch (e) { next(e); }
};
