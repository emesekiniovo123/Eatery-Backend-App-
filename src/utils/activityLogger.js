const Activity = require('../models/Activity');

const recordActivity = async ({
  user,
  action,
  resourceType = '',
  resourceId = '',
  metadata = {},
}) => {
  if (!user || !action) return null;

  try {
    const userDoc = typeof user === 'object' && user._id ? user : { _id: user };

    const activity = await Activity.create({
      user: userDoc._id,
      userName: userDoc.fullName || userDoc.name || '',
      userEmail: userDoc.email || '',
      action,
      resourceType,
      resourceId: String(resourceId || ''),
      metadata: metadata || {},
    });

    return activity;
  } catch (error) {
    console.error('Activity logging failed:', error.message);
    return null;
  }
};

module.exports = { recordActivity };
