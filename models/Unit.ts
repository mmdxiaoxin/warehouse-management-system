import Realm, {BSON} from 'realm';

export class Unit extends Realm.Object {
  _id!: BSON.ObjectId;
  name!: string;
  ctime!: Date;
  utime!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Unit',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      ctime: 'date',
      utime: 'date',
    },
  };
}
