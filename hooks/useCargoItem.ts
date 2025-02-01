import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {CargoItem} from '../models/CargoItem';

export type CargoItemData = Pick<CargoItem, 'models' | 'quantity'>;

export const useCargoItem = () => {
  const realm = useRealm();
  // 查询所有的 CargoItem 数据
  const cargoItemList = useQuery(CargoItem);

  // 创建新的 CargoItem
  const createCargoItem = (
    cargoId: BSON.ObjectId,
    cargoItemData: CargoItemData,
  ) => {
    try {
      const newItemId = new BSON.ObjectId();
      realm.write(() => {
        const cargo = realm.objectForPrimaryKey(Cargo, cargoId); // 获取关联的 Cargo 实例
        if (!cargo) {
          console.log('Cargo not found!');
          return;
        }

        // 创建新的 CargoItem
        const newCargoItem = realm.create(CargoItem, {
          _id: newItemId,
          ...cargoItemData,
          ctime: new Date(),
        });

        // 将新创建的 CargoItem 直接关联到 Cargo 的 items 列表
        cargo.items.push(newCargoItem);
      });
      return newItemId;
    } catch (error) {
      console.error('创建失败:', error);
      return null;
    }
  };

  // 更新货物中的某个 CargoItem
  const updateCargoItem = (
    cargoId: BSON.ObjectId,
    itemId: BSON.ObjectId,
    cargoItemData: {
      models?: string;
      quantity?: number;
    },
  ) => {
    realm.write(() => {
      const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
      if (cargo) {
        // 查找要更新的 CargoItem
        const cargoItem = cargo.items.find(
          item => item._id.toString() === itemId.toString(),
        );
        if (cargoItem) {
          if (cargoItemData.models) cargoItem.models = cargoItemData.models;
          if (cargoItemData.quantity !== undefined)
            cargoItem.quantity = cargoItemData.quantity;
          cargo.utime = new Date(); // 更新时间
        }
      }
    });
  };

  // 删除CargoItem
  const deleteCargoItem = (cargoId: BSON.ObjectId, itemId: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
        if (cargo) {
          const cargoItemToDelete = cargo.items.find(
            item => item._id.toString() === itemId.toString(),
          );
          if (cargoItemToDelete) {
            realm.delete(cargoItemToDelete);
            console.log('CargoItem deleted:', cargoItemToDelete);
          }
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    cargoItemList,
    createCargoItem,
    updateCargoItem,
    deleteCargoItem,
  };
};
