const mongoose = require('mongoose');

const ROLES = [
  'CEO',
  'Manager',
  'Project Manager',
  'Team Lead',
  'Junior',
  'Associate',
  'Intern',
];

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    phone: { type: String, default: '' },
    designation: {
      type: String,
      enum: ROLES,
      required: [true, 'Designation is required'],
    },
    department: {
      type: String,
      default: 'General',
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    joiningDate: { type: Date, default: Date.now },
    salary: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave'],
      default: 'active',
    },
    avatar: { type: String, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for children
employeeSchema.virtual('children', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'parent',
});

employeeSchema.index({ parent: 1 });
employeeSchema.index({ designation: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
module.exports.ROLES = ROLES;
