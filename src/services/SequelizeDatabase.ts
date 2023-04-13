import assert from 'assert';

import logger from '@/logger';
import type { Models } from '@/models';
import { models } from '@/models';
import { KEY_LEN, SALT_LEN } from '@/models/User';
import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';

@Service()
export default class SequelizeDatabase {
  static readonly USER_SALT_LEN = SALT_LEN;
  static readonly USER_KEY_LEN = KEY_LEN;

  readonly sequelize: Sequelize;
  readonly models: Models;

  readonly UserModel: Models['User'];
  readonly ShortLinkModel: Models['ShortLink'];
  readonly ShortLinkViewModel: Models['ShortLinkView'];
  readonly ShortLinkMetaModel: Models['ShortLinkMeta'];

  constructor() {
    const uri = process.env.SEQUELIZE_URI;
    assert(uri && uri.length, 'SEQUELIZE_URI is not defined');

    this.sequelize = new Sequelize(uri, {
      logging: process.env.OMIT_SEQUELIZE_LOGGING
        ? void 0
        : logger.debug.bind(logger),

      models,

      define: {
        underscored: true,
        timestamps: true,
        paranoid: true,
      },
    });

    this.models = this.sequelize.models as unknown as Models;

    this.UserModel = this.models.User;
    this.ShortLinkModel = this.models.ShortLink;
    this.ShortLinkViewModel = this.models.ShortLinkView;
    this.ShortLinkMetaModel = this.models.ShortLinkMeta;
  }
}
