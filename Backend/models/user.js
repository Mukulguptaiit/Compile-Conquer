import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email already in use.' },
      validate: {
        isEmail: { msg: 'Must be a valid email address.' },
        notEmpty: { msg: 'Email cannot be empty' },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'Password must be at least 6 characters long.',
        },
        notEmpty: { msg: 'Password cannot be empty' },
      },
    },

    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  }, {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {},
    },
  });

  // 🔐 Hash password before saving
  const hashPassword = async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  };

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);

  // 🔐 Compare password instance method
  User.prototype.validatePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
  };

  // ✂️ Hide password in responses
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
