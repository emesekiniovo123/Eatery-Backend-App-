
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

// =====================================
// User Schema
// =====================================
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
    },

    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
      default: '',
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    address: {
      type: String,
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
      default: '',
    },

    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },

    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Food',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// =====================================
// Indexes
// =====================================
userSchema.index({ role: 1 });

// =====================================
// Hash Password Before Saving
// =====================================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (error) {
    next(error);
  }
});

// =====================================
// Compare Password
// =====================================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// =====================================
// Export Model
// =====================================
module.exports = model('User', userSchema);