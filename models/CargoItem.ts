import Realm, {BSON} from 'realm';

export class CargoItem extends Realm.Object {
  _id!: BSON.ObjectId;
  models!: string;
  quantity!: number;
  ctime!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'CargoItem',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      cargo: {
        type: 'linkingObjects',
        objectType: 'Cargo', // 关联到 Cargo 模型
        property: 'items', // 反向关系字段名
      },
      models: 'string',
      quantity: 'int',
      ctime: 'date',
    },
  };
}
