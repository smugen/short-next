import assert from 'assert';

import logger from '@/logger';
import type { Models } from '@/models';
import { models } from '@/models';
import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

@Service()
export default class SequelizeDatabase {
  readonly sequelize: Sequelize;
  readonly models: Models;

  readonly EntryModel: Models['Entry'];

  constructor() {
    const uri = process.env.SEQUELIZE_URI;
    assert(uri && uri.length, 'SEQUELIZE_URI is not defined');

    this.sequelize = new Sequelize(uri, {
      logging: logger.debug.bind(logger),

      models,

      define: {
        underscored: true,
        timestamps: true,
        paranoid: true,
      },
    });

    this.models = this.sequelize.models as unknown as Models;

    this.EntryModel = this.models.Entry;
  }
}
