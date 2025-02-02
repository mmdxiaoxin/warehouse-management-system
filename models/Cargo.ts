import Realm, {BSON} from 'realm';
import {Model} from './Model';

export class Cargo extends Realm.Object {
  _id!: BSON.ObjectId;
  name!: string;
  category?: string;
  unit?: string;
  price?: number;
  brand?: string;
  models!: Realm.List<Model>;
  description?: string;
  ctime?: Date;
  utime?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Cargo',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      category: 'string',
      unit: 'string?',
      price: 'double?',
      brand: 'string?',
      models: 'Model[]',
      description: 'string?',
      ctime: 'date?',
      utime: 'date?',
    },
  };
}
