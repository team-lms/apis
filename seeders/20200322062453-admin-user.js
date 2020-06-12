module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    firstName: 'Admin',
    email: 'admin@lms.com',
    phoneNumber: '8075438923',
    pinCode: '123456',
    address: 'Somewhere in the world',
    dateOfBirth: new Date('01-01-1990'),
    nationality: 'Indian',
    hiredOn: new Date(),
    password: '$2a$10$4mq6Qk3Qjd0F/OdZOXR5KOaaq1Qqswf0n2sEKu.7HyYwjWTsuXTBW',
    designation: 'Administrator',
    role: 'Admin',
    status: 'Active',
    employeeId: 'EMP00001',
    createdAt: new Date(),
    updatedAt: new Date()
  }]),
  down: (queryInterface) => queryInterface.bulkUpdate('Users', null, {})
};
