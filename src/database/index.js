import Sequelize from 'sequelize';

import Student from '../app/models/Students';
import Checkin from '../app/models/Checkins';
import User from '../app/models/Users';
import Plan from '../app/models/Plans';
import Enrollment from '../app/models/Enrollments';
import HelpOrder from '../app/models/HelpOrders';

import databaseConfig from '../config/database';

const models = [Student, User, Plan, Enrollment, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
