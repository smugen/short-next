import crypto from 'crypto';

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

afterAll(() => db.sequelize.close());

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

      expect(db.models.ShortLink).toBeDefined();
      expect(db.ShortLinkModel).toBeDefined();
      expect(db.ShortLinkModel).toBe(db.models.ShortLink);

      expect(db.models.ShortLinkView).toBeDefined();
      expect(db.ShortLinkViewModel).toBeDefined();
      expect(db.ShortLinkViewModel).toBe(db.models.ShortLinkView);

      expect(db.models.ShortLinkMeta).toBeDefined();
      expect(db.ShortLinkMetaModel).toBeDefined();
      expect(db.ShortLinkMetaModel).toBe(db.models.ShortLinkMeta);
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

  describe('#ShortLinkModel', () => {
    const { ShortLink, User } = db.models;
    let userId: string;
    let shortLinkId: string;
    let slug: string;
    const fullLink = 'https://example.com';

    beforeAll(async () => {
      const user = await (
        await User.build({
          username: `${crypto.randomUUID()}@example.com`,
        }).setPassword('password')
      ).save();
      userId = user.id;
    });

    it('should be able to save a short link with default slug', async () => {
      const shortLink = await ShortLink.create({ userId, fullLink });

      expect(shortLink).toBeInstanceOf(ShortLink);
      expect(shortLink.id).toStrictEqual(expect.any(String));
      expect(shortLink.slug).toStrictEqual(expect.any(String));
      expect(shortLink.fullLink).toBe(fullLink);
      expect(shortLink.userId).toBe(userId);

      shortLinkId = shortLink.id;
      slug = shortLink.slug;
    });

    it('should find a short link by slug', async () => {
      const shortLink = await ShortLink.findOne({ where: { slug } });

      expect(shortLink).toBeInstanceOf(ShortLink);
      expect(shortLink?.id).toBe(shortLinkId);
      expect(shortLink?.slug).toBe(slug);
      expect(shortLink?.fullLink).toBe(fullLink);
      expect(shortLink?.userId).toBe(userId);
    });

    it('should find a short link by userId', async () => {
      const shortLink = await ShortLink.findOne({ where: { userId } });

      expect(shortLink).toBeInstanceOf(ShortLink);
      expect(shortLink?.id).toBe(shortLinkId);
      expect(shortLink?.slug).toBe(slug);
      expect(shortLink?.fullLink).toBe(fullLink);
      expect(shortLink?.userId).toBe(userId);
    });
  });

  describe('#ShortLinkViewModel', () => {
    const { ShortLinkView, ShortLink, User } = db.models;
    let shortLinkId: string;

    beforeAll(async () => {
      const user = await (
        await User.build({
          username: `${crypto.randomUUID()}@example.com`,
        }).setPassword('password')
      ).save();

      const shortLink = await ShortLink.create({
        userId: user.id,
        fullLink: 'https://example.com',
      });

      shortLinkId = shortLink.id;
    });

    it('should be able to save a short link view', async () => {
      const shortLinkView = await ShortLinkView.create({ shortLinkId });

      expect(shortLinkView).toBeInstanceOf(ShortLinkView);
      expect(shortLinkView.id).toStrictEqual(expect.any(String));
      expect(shortLinkView.shortLinkId).toBe(shortLinkId);
    });

    it('should count short link views of a short link', async () => {
      let shortLinkViewCount = await ShortLinkView.count({
        where: { shortLinkId },
      });

      expect(shortLinkViewCount).toBe(1);

      await ShortLinkView.create({ shortLinkId });
      shortLinkViewCount = await ShortLinkView.count({
        where: { shortLinkId },
      });

      expect(shortLinkViewCount).toBe(2);
    });
  });

  describe('#ShortLinkMetaModel', () => {
    const { ShortLinkMeta, ShortLink, User } = db.models;
    let shortLinkId: string;
    const tagName = 'TITLE';
    const rawText = 'Example Title';
    const content = 'meta content';
    const property = 'meta property';
    const name = 'meta name';

    beforeAll(async () => {
      const user = await (
        await User.build({
          username: `${crypto.randomUUID()}@example.com`,
        }).setPassword('password')
      ).save();

      const shortLink = await ShortLink.create({
        userId: user.id,
        fullLink: 'https://example.com',
      });

      shortLinkId = shortLink.id;
    });

    it('should be able to save a short link meta', async () => {
      const shortLinkMeta = await ShortLinkMeta.create({
        shortLinkId,
        tagName,
        rawText,
        content,
        property,
        name,
      });

      expect(shortLinkMeta).toBeInstanceOf(ShortLinkMeta);
      expect(shortLinkMeta.id).toStrictEqual(expect.any(String));
      expect(shortLinkMeta.shortLinkId).toBe(shortLinkId);
      expect(shortLinkMeta.tagName).toBe(tagName);
      expect(shortLinkMeta.rawText).toBe(rawText);
      expect(shortLinkMeta.content).toBe(content);
      expect(shortLinkMeta.property).toBe(property);
      expect(shortLinkMeta.name).toBe(name);
    });

    it('should find some short link meta of a short link', async () => {
      await ShortLinkMeta.create({
        shortLinkId,
        tagName,
        rawText,
        content,
        property,
        name,
      });

      const shortLink = await ShortLink.findByPk(shortLinkId, {
        include: ShortLinkMeta,
      });

      expect(shortLink?.metaList).toBeInstanceOf(Array);
      expect(shortLink?.metaList?.length).toBe(2);
    });
  });
});
