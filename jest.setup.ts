import 'reflect-metadata';

import schemaFactory, { setup } from '@/graphql';

module.exports = async () => await setup(await schemaFactory());
