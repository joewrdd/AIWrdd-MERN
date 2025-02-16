//----- Calculates Next Billing Date For Trial Expiration -----
const calculateNextBillingDate = () => {
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  return oneMonthFromNow;
};

module.exports = { calculateNextBillingDate };
