import Realm, {BSON} from 'realm';
import {Category} from './Category';
import {Model} from './Model';
import {Unit} from './Unit';
import {Brand} from './Brand';

export class Cargo extends Realm.Object {
  _id!: BSON.ObjectId;
  name!: string;
  category?: Category;
  unit?: Unit;
  brand?: Brand;
  price?: number;
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
      brand: 'Brand?',
      price: 'double?',
      models: 'Model[]',
      description: 'string?',
      ctime: 'date?',
      utime: 'date?',
    },
  };
}
