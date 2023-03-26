import { Table } from 'sequelize-typescript';

import BaseModel from './BaseModel';

@Table<Entry>({})
export class Entry extends BaseModel<Entry> {}
