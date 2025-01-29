import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {CargoItem} from '../models/CargoItem';

export const useCargoItem = () => {
  const realm = useRealm();

  // 查询所有的 CargoItem 数据
  const cargoItemList = useQuery(CargoItem);

  // 创建新的 CargoItem
  const createCargoItem = (
    cargoId: BSON.ObjectId,
    cargoItemData: Omit<CargoItem, '_id' | 'cargo'>,
  ) => {
    realm.write(() => {
      const cargo = realm.objectForPrimaryKey(Cargo, cargoId); // 获取关联的 Cargo 实例
      if (!cargo) {
        console.log('Cargo not found!');
        return;
      }

      // 创建新的 CargoItem
      const newCargoItem = realm.create(CargoItem, {
        _id: new BSON.ObjectId(),
        ...cargoItemData,
        ctime: new Date(),
      });

      // 将新创建的 CargoItem 直接关联到 Cargo 的 items 列表
      cargo.items.push(newCargoItem);
    });
  };

  // 删除 CargoItem
  const deleteCargoItem = (cargoItemId: BSON.ObjectId) => {
    realm.write(() => {
      const cargoItemToDelete = realm.objectForPrimaryKey(
        CargoItem,
        cargoItemId,
      );
      if (cargoItemToDelete) {
        realm.delete(cargoItemToDelete);
        console.log('CargoItem deleted:', cargoItemToDelete);
      }
    });
  };

  return {
    cargoItemList,
    createCargoItem,
    deleteCargoItem,
  };
};
