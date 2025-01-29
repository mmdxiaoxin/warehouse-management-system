import {useRealm, useQuery} from '@realm/react';
import {Cargo} from '../models/Cargo';
import {BSON} from 'realm';

export const useCargo = () => {
  const realm = useRealm();

  // 查询所有的 Cargo 数据
  const cargoList = useQuery(Cargo);

  // 创建新的 Cargo
  const createCargo = (cargoData: Omit<Cargo, '_id'>) => {
    realm.write(() => {
      const newCargo = realm.create(Cargo, {
        _id: new BSON.ObjectId(),
        ...cargoData,
        ctime: new Date(),
        utime: new Date(),
      });
      console.log('Created new Cargo:', newCargo);
    });
  };

  // 更新 Cargo
  const updateCargo = (cargoId: BSON.ObjectId, updatedData: Partial<Cargo>) => {
    realm.write(() => {
      const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
      if (cargo) {
        Object.assign(cargo, updatedData, {utime: new Date()});
      }
    });
  };

  // 删除 Cargo
  const deleteCargo = (cargoId: BSON.ObjectId) => {
    realm.write(() => {
      const cargoToDelete = realm.objectForPrimaryKey(Cargo, cargoId);
      if (cargoToDelete) {
        realm.delete(cargoToDelete);
        console.log('Cargo deleted:', cargoToDelete);
      }
    });
  };

  return {
    cargoList,
    createCargo,
    updateCargo,
    deleteCargo,
  };
};
