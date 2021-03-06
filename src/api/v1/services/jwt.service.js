const jwt = require('jsonwebtoken');

const JwtService = {

  /**
   * Create brand new token
   */
  createToken: ({
    id, email, role, phoneNumber, firstName, lastName
  }) => jwt.sign(
    {
      data: JSON.stringify({
        id,
        email,
        role,
        phoneNumber,
        firstName,
        lastName
      })
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1d' }
  ),

  /**
   * Generate authorization token and send with user details
   */
  generateJwtToken: (user) => {
    const token = JwtService.createToken(user);
    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        designation: user.designation,
        role: user.role,
        status: user.status,
        casualLeaves: user.casualLeaves,
        bufferLeaves: user.bufferLeaves,
        unAuthorizedLeaves: user.unAuthorizedLeaves,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
};

module.exports = JwtService;
