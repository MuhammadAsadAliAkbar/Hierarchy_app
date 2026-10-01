require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected. Seeding...');

  await Employee.deleteMany({});
  await User.deleteMany({});

  // Admin user
  await User.create({
    name: 'Admin',
    email: 'admin@hierarchy.com',
    password: 'admin123',
  });
  console.log('Admin: admin@hierarchy.com / admin123');

  // Hierarchy
  const ceo = await Employee.create({
    name: 'Ahmed Khan',
    email: 'ceo@company.com',
    designation: 'CEO',
    department: 'Executive',
    employeeId: 'EMP001',
    salary: 500000,
  });

  const mgr1 = await Employee.create({
    name: 'Sara Ali',
    email: 'sara.manager@company.com',
    designation: 'Manager',
    department: 'Engineering',
    parent: ceo._id,
    employeeId: 'EMP002',
    salary: 250000,
  });

  const mgr2 = await Employee.create({
    name: 'Bilal Hassan',
    email: 'bilal.manager@company.com',
    designation: 'Manager',
    department: 'Product',
    parent: ceo._id,
    employeeId: 'EMP003',
    salary: 240000,
  });

  const pm1 = await Employee.create({
    name: 'Fatima Noor',
    email: 'fatima.pm@company.com',
    designation: 'Project Manager',
    department: 'Engineering',
    parent: mgr1._id,
    employeeId: 'EMP004',
    salary: 180000,
  });

  const pm2 = await Employee.create({
    name: 'Usman Raza',
    email: 'usman.pm@company.com',
    designation: 'Project Manager',
    department: 'Engineering',
    parent: mgr1._id,
    employeeId: 'EMP005',
    salary: 175000,
  });

  const tl1 = await Employee.create({
    name: 'Ayesha Malik',
    email: 'ayesha.tl@company.com',
    designation: 'Team Lead',
    department: 'Engineering',
    parent: pm1._id,
    employeeId: 'EMP006',
    salary: 140000,
  });

  const tl2 = await Employee.create({
    name: 'Hamza Iqbal',
    email: 'hamza.tl@company.com',
    designation: 'Team Lead',
    department: 'Engineering',
    parent: pm1._id,
    employeeId: 'EMP007',
    salary: 135000,
  });

  const tl3 = await Employee.create({
    name: 'Zainab Shah',
    email: 'zainab.tl@company.com',
    designation: 'Team Lead',
    department: 'Product',
    parent: pm2._id,
    employeeId: 'EMP008',
    salary: 130000,
  });

  // Juniors / Associates / Interns
  await Employee.create([
    { name: 'Ali Raza', email: 'ali.junior@company.com', designation: 'Junior', department: 'Engineering', parent: tl1._id, employeeId: 'EMP009', salary: 80000 },
    { name: 'Maria Khan', email: 'maria.junior@company.com', designation: 'Junior', department: 'Engineering', parent: tl1._id, employeeId: 'EMP010', salary: 78000 },
    { name: 'Omar Farooq', email: 'omar.assoc@company.com', designation: 'Associate', department: 'Engineering', parent: tl2._id, employeeId: 'EMP011', salary: 95000 },
    { name: 'Hina Tariq', email: 'hina.assoc@company.com', designation: 'Associate', department: 'Engineering', parent: tl2._id, employeeId: 'EMP012', salary: 92000 },
    { name: 'Samiullah', email: 'sami.intern@company.com', designation: 'Intern', department: 'Engineering', parent: tl1._id, employeeId: 'EMP013', salary: 30000 },
    { name: 'Noor Fatima', email: 'noor.intern@company.com', designation: 'Intern', department: 'Product', parent: tl3._id, employeeId: 'EMP014', salary: 28000 },
    { name: 'Kashif Mehmood', email: 'kashif.junior@company.com', designation: 'Junior', department: 'Product', parent: tl3._id, employeeId: 'EMP015', salary: 75000 },
  ]);

  console.log('Seed complete! 15 employees + admin user created.');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
