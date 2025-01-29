import Realm from 'realm';
import {CargoItem} from './CargoItemModel';
import {Cargo} from './CargoModel';
import uuid from 'react-native-uuid'; // 引入 react-native-uuid 生成唯一 ID

export type CargoItemData = {
  cargoId: string; // 关联的 Cargo 的 ID
  models: string; // 规格描述
};

class CargoItemRepository {
  private realm: Realm | null = null;

  // 打开 Realm 数据库
  private async getRealm() {
    if (!this.realm) {
      try {
        this.realm = await Realm.open({
          path: 'cargoItem.realm',
          schema: [CargoItem, Cargo],
        });
      } catch (error) {
        console.error('Failed to open Realm:', error);
        throw error;
      }
    }
    return this.realm;
  }

  // 创建 CargoItem
  async createCargoItem(cargoItemData: CargoItemData) {
    const realm = await this.getRealm();
    try {
      const id = uuid.v4().toString(); // 生成 CargoItem 的唯一 ID

      const cargo = realm.objectForPrimaryKey('Cargo', cargoItemData.cargoId);
      if (!cargo) {
        console.error('Cargo not found!');
        return;
      }

      realm.write(() => {
        realm.create('CargoItem', {
          id,
          cargo: cargo, // 关联到 Cargo
          models: cargoItemData.models,
        });
      });
      console.log('CargoItem added!');
    } catch (error) {
      console.error('Failed to create cargo item:', error);
    }
  }

  // 获取所有 CargoItem
  async getAllCargoItems() {
    const realm = await this.getRealm();
    try {
      return Array.from(realm.objects('CargoItem'));
    } catch (error) {
      console.error('Failed to fetch cargo items:', error);
      return [];
    }
  }

  // 通过 id 获取单个 CargoItem
  async getCargoItemById(id: string) {
    const realm = await this.getRealm();
    try {
      const cargoItem = realm.objectForPrimaryKey('CargoItem', id);
      if (cargoItem) {
        return cargoItem;
      } else {
        console.log('CargoItem not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch cargo item by id:', error);
      return null;
    }
  }

  // 更新 CargoItem
  async updateCargoItem(id: string, cargoItemData: CargoItemData) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargoItem = realm.objectForPrimaryKey('CargoItem', id);
        if (cargoItem) {
          cargoItem.models = cargoItemData.models;
        }
      });
      console.log('CargoItem updated!');
    } catch (error) {
      console.error('Failed to update cargo item:', error);
    }
  }

  // 删除 CargoItem
  async deleteCargoItem(id: string) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargoItem = realm.objectForPrimaryKey('CargoItem', id);
        if (cargoItem) {
          realm.delete(cargoItem);
        }
      });
      console.log('CargoItem deleted!');
    } catch (error) {
      console.error('Failed to delete cargo item:', error);
    }
  }

  // 批量删除 CargoItem
  async deleteMultipleCargoItems(cargoId: string) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargoItems = realm
          .objects('CargoItem')
          .filtered('cargo.cargoId == $0', cargoId);
        realm.delete(cargoItems);
      });
      console.log(`Deleted all cargo items for cargo ID "${cargoId}"`);
    } catch (error) {
      console.error('Failed to delete multiple cargo items:', error);
    }
  }

  // 根据 cargoId 获取相关的 CargoItem 数量
  async getCargoItemCountByCargoId(cargoId: string) {
    const realm = await this.getRealm();
    try {
      const cargoItems = realm
        .objects('CargoItem')
        .filtered('cargo.cargoId == $0', cargoId);
      return cargoItems.length;
    } catch (error) {
      console.error('Failed to fetch cargo item count by cargoId:', error);
      return 0;
    }
  }

  // 关闭 Realm 实例
  close() {
    if (this.realm) {
      this.realm.close();
      this.realm = null;
    }
  }
}

export const cargoItemRepository = new CargoItemRepository();
