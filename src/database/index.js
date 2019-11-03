import Sequelize from 'sequelize';

import Student from '../app/models/Students';
import User from '../app/models/Users';
import Plan from '../app/models/Plans';

import databaseConfig from '../config/database';

const models = [Student, User, Plan];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
