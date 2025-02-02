import {useRealm, useQuery} from '@realm/react';
import {Cargo} from '../models/Cargo';
import {BSON} from 'realm';

export type CargoData = Pick<
  Cargo,
  'name' | 'category' | 'unit' | 'description' | 'price' | 'brand'
>;

export const useCargo = () => {
  const realm = useRealm();

  // 查询所有的 Cargo 数据
  const cargoList = useQuery(Cargo);

  // 创建新的 Cargo
  const createCargo = (cargoData: CargoData) => {
    try {
      const newCargoId = new BSON.ObjectId();
      realm.write(() => {
        realm.create(Cargo, {
          _id: newCargoId,
          ...cargoData,
          ctime: new Date(),
          utime: new Date(),
        });
      });
      return newCargoId;
    } catch (error) {
      console.error('创建失败:', error);
      return null;
    }
  };

  // 更新 Cargo
  const updateCargo = (cargoId: BSON.ObjectId, updatedData: CargoData) => {
    realm.write(() => {
      const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
      if (cargo) {
        if (updatedData.name !== undefined) cargo.name = updatedData.name;
        if (updatedData.category !== undefined)
          cargo.category = updatedData.category;
        if (updatedData.unit !== undefined) cargo.unit = updatedData.unit;
        if (updatedData.price !== undefined) cargo.price = updatedData.price;
        if (updatedData.brand !== undefined) cargo.brand = updatedData.brand;
        if (updatedData.description !== undefined)
          cargo.description = updatedData.description;
        cargo.utime = new Date();
      }
    });
  };

  // 删除 Cargo
  const deleteCargo = (cargoId: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const cargoToDelete = realm.objectForPrimaryKey(Cargo, cargoId);
        if (cargoToDelete) {
          // 删除关联的所有 Model
          realm.delete(cargoToDelete.models); // 删除 items 中的所有 Model

          // 删除 Cargo 本身
          realm.delete(cargoToDelete);
          console.log('Cargo and associated items deleted:', cargoToDelete);
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    cargoList,
    createCargo,
    updateCargo,
    deleteCargo,
  };
};
