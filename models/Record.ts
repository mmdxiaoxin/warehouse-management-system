import Realm, {BSON} from 'realm';

export class Record extends Realm.Object {
  _id!: BSON.ObjectId;
  status!: boolean;
  detail!: string; // JSON string {cargoId: string, models: {modelId: string, quantity: int}[]}
  ctime!: Date;
  utime!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Record',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      status: 'bool',
      detail: 'string',
      ctime: 'date',
      utime: 'date',
    },
  };
}
