import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Category} from '../models/Category';

export const useCategory = () => {
  const realm = useRealm();
  // 查询所有的 Category 数据
  const categories = useQuery(Category);

  // 创建新的 Category
  const createCategory = (name: string, description: string) => {
    try {
      const newId = new BSON.ObjectId();
      realm.write(() => {
        realm.create(Category.schema.name, {
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

  // 更新货物中的某个 Category
  const updateCategory = (
    id: BSON.ObjectId,
    category: {
      name: string;
      description?: string;
    },
  ) => {
    try {
      realm.write(() => {
        const categoryToUpdate = realm.objectForPrimaryKey(Category, id);
        if (categoryToUpdate) {
          // 更新 Category
          categoryToUpdate.name = category.name;
          if (category.description)
            categoryToUpdate.description = category.description;
          categoryToUpdate.utime = new Date();
        }
      });
    } catch (error) {
      console.error('更新失败:', error);
      throw error;
    }
  };

  // 删除 Category
  const deleteCategory = (id: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const categoryToDelete = realm.objectForPrimaryKey(Category, id);
        if (categoryToDelete) {
          realm.delete(categoryToDelete);
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
