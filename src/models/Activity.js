const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    userName: {
      type: String,
      default: '',
      trim: true,
    },

    userEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    resourceType: {
      type: String,
      default: '',
      trim: true,
    },

    resourceId: {
      type: String,
      default: '',
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
