// Find the email verification handler function
exports.verifyEmail = async (req, res) => {
  // Email verification is no longer needed, redirecting to dashboard
  return res.redirect('/dashboard');
};
