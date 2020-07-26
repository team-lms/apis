const {
  DefaultValuesConstants,
  RolesConstants,
  StatusConstants,
  SexConstants,
  MaritalStatusConstants,
  JobTypeConstants
} = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    middleName: {
      type: DataTypes.STRING(50)
    },
    lastName: {
      type: DataTypes.STRING(50)
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(100),
      unique: true
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.STRING(10),
      unique: true
    },
    whatsappNumber: {
      unique: true,
      type: DataTypes.STRING(10)
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    pinCode: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    sex: {
      allowNull: false,
      type: DataTypes.ENUM(
        SexConstants.MALE,
        SexConstants.FEMALE,
        SexConstants.OTHER
      )
    },
    maritalStatus: {
      allowNull: false,
      type: DataTypes.ENUM(
        MaritalStatusConstants.SINGLE,
        MaritalStatusConstants.MARRIED,
        MaritalStatusConstants.WIDOWED,
        MaritalStatusConstants.SEPARATED,
        MaritalStatusConstants.DIVORCED
      )
    },
    nationality: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    hiredOn: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deviceToken: {
      type: DataTypes.STRING(50)
    },
    appVersion: {
      type: DataTypes.STRING(50)
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    designation: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM(
        RolesConstants.ADMIN,
        RolesConstants.SUPERVISOR,
        RolesConstants.HR,
        RolesConstants.EMPLOYEE
      ),
      defaultValue: RolesConstants.EMPLOYEE
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      ),
      defaultValue: StatusConstants.INACTIVE
    },
    employeeId: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    jobType: {
      allowNull: false,
      type: DataTypes.ENUM(
        JobTypeConstants.PART_TIME,
        JobTypeConstants.FULL_TIME
      ),
      default: JobTypeConstants.FULL_TIME
    },
    profilePicture: {
      type: DataTypes.STRING(100)
    },
    casualLeaves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DefaultValuesConstants.USER_CASUAL_LEAVES
    },
    bufferLeaves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DefaultValuesConstants.USER_BUFFER_LEAVES
    },
    unAuthorizedLeaves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DefaultValuesConstants.USER_UNAUTHORIZED_LEAVES
    },
    teamId: {
      type: DataTypes.INTEGER
    }
  }, { paranoid: true });

  User.associate = (models) => {
    User.hasMany(models.Otp, { as: 'otps', foreignKey: 'userId', foreignKeyConstraint: true });
    User.hasMany(models.Leave, { as: 'leaves', foreignKey: 'userId', foreignKeyConstraint: true });
    User.belongsTo(models.Team, { as: 'team', foreignKey: 'teamId', foreignKeyConstraint: true });
    User.belongsTo(models.Designation, { as: 'designationDetails', foreignKey: 'designation', foreignKeyConstraint: true });
  };

  return User;
};
