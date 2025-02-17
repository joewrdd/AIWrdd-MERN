//----- Subscription Validation -----
const validateSubscription = (req, res, next) => {
  const validPlans = ["Free", "Basic", "Premium"];
  const { subscription } = req.body;

  if (!subscription || !validPlans.includes(subscription)) {
    return res.status(400).json({
      status: false,
      message: "Invalid subscription plan",
      validPlans,
    });
  }

  next();
};

module.exports = validateSubscription;
