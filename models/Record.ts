import Realm, {BSON} from 'realm';

export class Record extends Realm.Object {
  _id!: BSON.ObjectId;
  type!: 'inbound' | 'outbound' | 'transfer';
  status!: boolean;
  detail!: RecordDetail[];
  ctime!: Date;
  utime!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Record',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      type: 'string',
      status: 'bool',
      detail: 'RecordDetail[]',
      ctime: 'date',
      utime: 'date',
    },
  };
}

export class RecordDetail extends Realm.Object {
  cargoId!: BSON.ObjectId;
  cargoName!: string;
  cargoModels!: RecordDetailModel[];
  unit!: string;

  static schema: Realm.ObjectSchema = {
    name: 'RecordDetail',
    embedded: true,
    properties: {
      cargoId: 'objectId',
      cargoName: 'string',
      cargoModels: 'RecordDetailModel[]',
    },
  };
}

export class RecordDetailModel extends Realm.Object {
  modelId!: BSON.ObjectId;
  modelName!: string;
  quantity!: number;

  static schema: Realm.ObjectSchema = {
    name: 'RecordDetailModel',
    embedded: true,
    properties: {
      modelId: 'objectId',
      modelName: 'string',
      quantity: 'int',
    },
  };
}
