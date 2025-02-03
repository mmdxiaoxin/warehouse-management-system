import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {Model} from '../models/Model';

export type ModelData = Pick<
  Model,
  'name' | 'value' | 'quantity' | 'description'
>;

export const useModel = () => {
  const realm = useRealm();
  // 查询所有的 Model 数据
  const modelList = useQuery(Model);

  // 创建新的 Model
  const createModel = (cargoId: BSON.ObjectId, modelData: ModelData) => {
    try {
      const newItemId = new BSON.ObjectId();
      realm.write(() => {
        const cargo = realm.objectForPrimaryKey(Cargo, cargoId); // 获取关联的 Cargo 实例
        if (!cargo) {
          console.log('Cargo not found!');
          return;
        }

        // 创建新的 Model
        const newModel = realm.create(Model, {
          _id: newItemId,
          ...modelData,
          ctime: new Date(),
          utime: new Date(),
        });

        // 将新创建的 Model 直接关联到 Cargo 的 items 列表
        cargo.models.push(newModel);
      });
      return newItemId;
    } catch (error) {
      console.error('创建失败:', error);
      return null;
    }
  };

  // 更新货物中的某个 Model
  const updateModel = (
    cargoId: BSON.ObjectId,
    modelId: BSON.ObjectId,
    modelData: ModelData,
  ) => {
    realm.write(() => {
      const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
      if (cargo) {
        // 查找要更新的 Model
        const model = cargo.models.find(
          item => item._id.toString() === modelId.toString(),
        );
        if (model) {
          if (modelData.value) model.value = modelData.value;
          if (modelData.quantity) model.quantity = modelData.quantity;
          if (modelData.name) model.name = modelData.name;
          if (modelData.description) model.description = modelData.description;
          model.utime = new Date();
        }
      }
    });
  };

  // 删除 Model
  const deleteModel = (cargoId: BSON.ObjectId, modelId: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
        if (cargo) {
          const modelToDelete = cargo.models.find(
            item => item._id.toString() === modelId.toString(),
          );
          if (modelToDelete) {
            realm.delete(modelToDelete);
          }
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    modelList,
    createModel,
    updateModel,
    deleteModel,
  };
};
