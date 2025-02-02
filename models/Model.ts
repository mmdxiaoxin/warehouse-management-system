import Realm, {BSON} from 'realm';

export class Model extends Realm.Object {
  _id!: BSON.ObjectId;
  value!: string;
  quantity!: number;
  ctime!: Date;
  utime!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Model',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      cargo: {
        type: 'linkingObjects',
        objectType: 'Cargo', // 关联到 Cargo 模型
        property: 'models', // 反向关系字段名
      },
      value: 'string',
      quantity: 'int',
      ctime: 'date',
      utime: 'date',
    },
  };
}
