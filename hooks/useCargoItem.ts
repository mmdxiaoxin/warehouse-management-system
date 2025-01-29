import {useRealm, useQuery} from '@realm/react';
import {CargoItem} from '../models/CargoItem';
import {Cargo} from '../models/Cargo';
import {BSON} from 'realm';

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
      console.log('Created new CargoItem:', newCargoItem);

      // 确保 items 数组已初始化，若未初始化则创建空数组
      if (!cargo.items) {
        cargo.items = new Realm.List<CargoItem>();
      }

      // 将新创建的 CargoItem 添加到 Cargo 的 items 数组中
      cargo.items.push(newCargoItem);
      console.log('Updated Cargo with new CargoItem:', cargo);
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
