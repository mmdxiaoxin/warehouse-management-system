import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Unit} from '../models/Unit';

export const useUnit = () => {
  const realm = useRealm();
  // 查询所有的 Unit 数据
  const units = useQuery(Unit);

  // 创建新的 Unit
  const createUnit = (name: string) => {
    try {
      const newId = new BSON.ObjectId();
      realm.write(() => {
        realm.create(Unit.schema.name, {
          _id: newId,
          name,
          ctime: new Date(),
          utime: new Date(),
        });
      });
      return newId;
    } catch (error) {
      console.error('创建失败:', error);
      return null;
    }
  };

  // 更新货物中的某个 Unit
  const updateUnit = (
    id: BSON.ObjectId,
    category: {
      name: string;
      description?: string;
    },
  ) => {
    try {
      realm.write(() => {
        const unitToUpdate = realm.objectForPrimaryKey(Unit, id);
        if (unitToUpdate) {
          // 更新 Unit
          unitToUpdate.name = category.name;
          unitToUpdate.utime = new Date();
        }
      });
    } catch (error) {
      console.error('更新失败:', error);
      throw error;
    }
  };

  // 删除 Unit
  const deleteUnit = (id: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const unitToDelete = realm.objectForPrimaryKey(Unit, id);
        if (unitToDelete) {
          realm.delete(unitToDelete);
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    units,
    createUnit,
    updateUnit,
    deleteUnit,
  };
};
