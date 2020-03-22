
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    firstName: 'Admin',
    email: 'admin@lms.com',
    phoneNumber: '9818263904',
    password: '$2a$10$4mq6Qk3Qjd0F/OdZOXR5KOaaq1Qqswf0n2sEKu.7HyYwjWTsuXTBW',
    designation: 'Administrator',
    role: 'Admin',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  }]),
  down: (queryInterface) => queryInterface.bulkUpdate('Users', null, {})
};
