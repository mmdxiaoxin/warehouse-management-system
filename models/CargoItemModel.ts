import Realm from 'realm';
export class CargoItem extends Realm.Object {
  static schema = {
    name: 'CargoItem',
    primaryKey: 'id',
    properties: {
      id: 'string',
      cargo: 'Cargo',
      models: 'string',
    },
  };
}
