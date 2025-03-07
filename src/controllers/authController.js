// ... existing code ...

// Find the email verification handler function
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).render('error', { 
        message: 'User not found. Please register again.' 
      });
    }
    
    // Update user verification status
    user.isVerified = true;
    await user.save();
    
    // Determine the appropriate dashboard based on user role
    let dashboardUrl = '/dashboard';
    if (user.role === 'admin') {
      dashboardUrl = '/admin/dashboard';
    } else if (user.role === 'landlord') {
      dashboardUrl = '/landlord/dashboard';
    } else if (user.role === 'tenant') {
      dashboardUrl = '/tenant/dashboard';
    }
    
    // Redirect to the appropriate dashboard
    return res.redirect(dashboardUrl);
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(400).render('error', { 
      message: 'Invalid or expired verification link. Please try again.' 
    });
  }
};

// ... existing code ...