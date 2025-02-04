import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Brand} from '../models/Brand';

export const useBrand = () => {
  const realm = useRealm();
  // 查询所有的 Brand 数据
  const brands = useQuery(Brand);

  // 创建新的 Brand
  const createBrand = (name: string, description: string) => {
    try {
      const newId = new BSON.ObjectId();
      realm.write(() => {
        realm.create(Brand.schema.name, {
          _id: newId,
          name,
          description,
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

  // 更新货物中的某个 Brand
  const updateBrand = (
    id: BSON.ObjectId,
    brand: {
      name: string;
      description?: string;
    },
  ) => {
    try {
      realm.write(() => {
        const brandToUpdate = realm.objectForPrimaryKey(Brand, id);
        if (brandToUpdate) {
          // 更新 Brand
          brandToUpdate.name = brand.name;
          if (brand.description) {
            brandToUpdate.description = brand.description;
          }
          brandToUpdate.utime = new Date();
        }
      });
    } catch (error) {
      console.error('更新失败:', error);
      throw error;
    }
  };

  // 删除 Brand
  const deleteBrand = (id: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const brandToDelete = realm.objectForPrimaryKey(Brand, id);
        if (brandToDelete) {
          realm.delete(brandToDelete);
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    brands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};
