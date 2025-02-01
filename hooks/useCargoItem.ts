import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {CargoItem} from '../models/CargoItem';
import {useCargo} from './useCargo';

export type CargoItemData = Pick<CargoItem, 'models' | 'quantity'>;

export const useCargoItem = () => {
  const realm = useRealm();
  const {deleteCargoItem} = useCargo();

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

  return {
    cargoItemList,
    createCargoItem,
    deleteCargoItem,
  };
};
