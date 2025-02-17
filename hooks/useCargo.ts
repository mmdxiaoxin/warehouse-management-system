import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Brand} from '../models';
import {Cargo} from '../models/Cargo';
import {Category} from '../models/Category';
import {Unit} from '../models/Unit';

export type CargoData = Partial<
  Pick<Cargo, 'name' | 'price' | 'description'>
> & {
  category?: BSON.ObjectId;
  unit?: BSON.ObjectId;
  brand?: BSON.ObjectId;
};

export const useCargo = () => {
  const realm = useRealm();

  // 查询所有的 Cargo 数据
  const cargoList = useQuery(Cargo);

  // 创建新的 Cargo
  const createCargo = (cargoData: CargoData) => {
    try {
      const newCargoId = new BSON.ObjectId();
      realm.write(() => {
        let category = undefined;
        if (cargoData.category) {
          category = realm.objectForPrimaryKey(Category, cargoData.category);
        }
        let brand = undefined;
        if (cargoData.brand) {
          brand = realm.objectForPrimaryKey(Brand, cargoData.brand);
        }
        let unit = undefined;
        if (cargoData.unit) {
          unit = realm.objectForPrimaryKey(Unit, cargoData.unit);
        }
        const newCargo = {
          _id: newCargoId,
          ...cargoData,
          category,
          unit,
          brand,
          ctime: new Date(),
          utime: new Date(),
        };
        realm.create(Cargo.schema.name, {
          ...newCargo,
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
        if (updatedData.price !== undefined) cargo.price = updatedData.price;
        if (updatedData.description !== undefined)
          cargo.description = updatedData.description;
        if (updatedData.category !== undefined) {
          const category = realm.objectForPrimaryKey(
            Category,
            updatedData.category,
          );
          if (category) {
            cargo.category = category;
          }
        }
        if (updatedData.brand !== undefined) {
          const brand = realm.objectForPrimaryKey(Brand, updatedData.brand);
          if (brand) {
            cargo.brand = brand;
          }
        }
        if (updatedData.unit !== undefined) {
          const unit = realm.objectForPrimaryKey(Unit, updatedData.unit);
          if (unit) {
            cargo.unit = unit;
          }
        }
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
