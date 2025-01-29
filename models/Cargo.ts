import Realm, {BSON} from 'realm';
import {CargoItem} from './CargoItem';

export class Cargo extends Realm.Object {
  _id!: BSON.ObjectId;
  name!: string;
  category!: string;
  unit!: string;
  items!: Realm.List<CargoItem>;
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
      unit: 'string',
      items: 'CargoItem[]',
      description: 'string?',
      ctime: 'date?',
      utime: 'date?',
    },
  };
}
