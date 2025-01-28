import Realm from 'realm';
export class Cargo extends Realm.Object {
  static schema = {
    name: 'Cargo',
    primaryKey: 'cargoId',
    properties: {
      cargoId: 'string',
      name: 'string',
      category: 'string',
      quantity: 'int',
      unit: 'string',
      description: 'string?',
      ctime: 'date',
      utime: 'date',
    },
  };
}
