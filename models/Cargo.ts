import Realm, {BSON} from 'realm';
import {Category} from './Category';
import {Model} from './Model';
import {Unit} from './Unit';

export class Cargo extends Realm.Object {
  _id!: BSON.ObjectId;
  name!: string;
  category?: Category;
  unit?: Unit;
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
      category: 'Category?',
      unit: 'Unit?',
      price: 'double?',
      brand: 'string?',
      models: 'Model[]',
      description: 'string?',
      ctime: 'date?',
      utime: 'date?',
    },
  };
}
