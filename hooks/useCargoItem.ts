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

      // 创建新的 CargoItem，Realm 会自动处理反向关系
      const newCargoItem = realm.create(CargoItem, {
        _id: new BSON.ObjectId(),
        ...cargoItemData,
        ctime: new Date(),
      });
      console.log('Created new CargoItem:', newCargoItem);
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
