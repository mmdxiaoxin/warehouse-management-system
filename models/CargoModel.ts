import Realm from 'realm';
export class Cargo extends Realm.Object {
  static schema = {
    name: 'Cargo',
    primaryKey: 'cargoId',
    properties: {
      cargoId: 'string',
      name: 'string',
      category: 'string',
      description: 'string?', // 可选字段
      weight: 'float',
      volume: 'float?',
      origin: 'string',
      destination: 'string',
      shippingDate: 'date',
      estimatedArrival: 'date',
      status: 'string',
      trackingNumber: 'string?', // 可选字段
    },
  };
}
