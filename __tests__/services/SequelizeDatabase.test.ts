import type { Entry } from '@/models';
import SequelizeDatabase from '@/services/SequelizeDatabase';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Sequelize } from 'sequelize-typescript';
const db = new SequelizeDatabase();

beforeAll(async () => {
  const NO_LOG_META = process.env.NO_LOG_META;
  process.env.NO_LOG_META = 'true';

  await db.sequelize.sync();

  process.env.NO_LOG_META = NO_LOG_META;
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('SequelizeDatabase', () => {
  describe('#sequelize', () => {
    it('should be an instance of Sequelize', () => {
      expect(db.sequelize).toBeInstanceOf(Sequelize);
    });
  });

  describe('#models', () => {
    it('Entry should be defined', () => {
      expect(db.models.Entry).toBeDefined();
      expect(db.EntryModel).toBeDefined();
      expect(db.EntryModel).toBe(db.models.Entry);
    });
  });

  describe('#EntryModel', () => {
    const { Entry } = db.models;
    let entry: Entry;

    it('should be able to build an entry', () => {
      entry = Entry.build();

      expect(entry).toBeInstanceOf(Entry);
      expect(entry.id).toStrictEqual(expect.any(String));
    });

    it('should be able to save an entry', async () => {
      await entry.save();

      expect(entry.createdAt).toBeInstanceOf(Date);
      expect(entry.updatedAt).toBeInstanceOf(Date);
      expect(entry.deletedAt).toBeUndefined();
    });
  });
});
