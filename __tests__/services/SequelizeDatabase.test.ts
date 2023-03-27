import type { User } from '@/models';
import SequelizeDatabase from '@/services/SequelizeDatabase';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Sequelize } from 'sequelize-typescript';
const db = new SequelizeDatabase();

beforeAll(async () => {
  const NO_LOG_META = process.env.NO_LOG_META;
  process.env.NO_LOG_META = 'true';

  await db.sequelize.sync();

  NO_LOG_META === void 0
    ? delete process.env.NO_LOG_META
    : (process.env.NO_LOG_META = NO_LOG_META);
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
    it('User should be defined', () => {
      expect(db.models.User).toBeDefined();
      expect(db.UserModel).toBeDefined();
      expect(db.UserModel).toBe(db.models.User);
    });
  });

  describe('#UserModel', () => {
    const { User } = db.models;
    let user: User;
    const password = 'password';

    it('should be able to build a user', () => {
      user = User.build();

      expect(user).toBeInstanceOf(User);
      expect(user.id).toStrictEqual(expect.any(String));
    });

    it('should be able to set password', async () => {
      await user.setPassword(password);

      expect(user.salt).toBeInstanceOf(Buffer);
      expect(user.salt).toHaveLength(SequelizeDatabase.USER_SALT_LEN);
      expect(user.derivedKey).toBeInstanceOf(Buffer);
      expect(user.derivedKey).toHaveLength(SequelizeDatabase.USER_KEY_LEN);
    });

    it('should be able to verify password', async () => {
      expect(await user.verifyPassword(password)).toBe(true);
      expect(await user.verifyPassword('wrong password')).toBe(false);
    });

    it('should be able to validate username', async () => {
      await expect(user.validate()).rejects.toMatchInlineSnapshot(`
        [SequelizeValidationError: notNull Violation: User.name cannot be null,
        notNull Violation: User.username cannot be null]
      `);
      user.username = 'invalid email';
      await expect(user.validate()).rejects.toMatchInlineSnapshot(
        `[SequelizeValidationError: Validation error: Validation isEmail on username failed]`,
      );
      user.username = 'abc@example.com';
      await user.validate();
    });

    it('should be able to default name from username', async () => {
      user.name = '';
      await user.validate();
      expect(user.name).toBe(user.username.split('@')[0]);
    });

    it('should be able to save a user', async () => {
      await user.save();

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.deletedAt).toBeUndefined();
    });

    it('should be able to find & verify a user', async () => {
      const verifiedUser = await User.verify(user.username, password);
      expect(verifiedUser).toBeInstanceOf(User);
      expect(verifiedUser?.id).toBe(user.id);

      const nonExistentUser = await User.verify('non-existent', password);
      const unverifiedUser = await User.verify(user.username, 'wrong password');
      expect(nonExistentUser).toBeNull();
      expect(unverifiedUser).toBeNull();
    });

    it('should reject creating another user with same username', async () => {
      const newUser = User.build();
      newUser.username = user.username;
      await newUser.setPassword(password);
      await expect(newUser.save()).rejects.toMatchInlineSnapshot(
        `[SequelizeUniqueConstraintError: Validation error]`,
      );
    });
  });
});
