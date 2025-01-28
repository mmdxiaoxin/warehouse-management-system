import Realm from 'realm';
import {Cargo} from './CargoModel';
import uuid from 'react-native-uuid'; // 引入 react-native-uuid

export type CargoData = {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  description?: string;
  ctime?: Date;
  utime?: Date;
};

class CargoRepository {
  private realm: Realm | null = null;

  // 打开 Realm 数据库
  private async getRealm() {
    if (!this.realm) {
      try {
        this.realm = await Realm.open({
          path: 'cargo.realm',
          schema: [Cargo],
        });
      } catch (error) {
        console.error('Failed to open Realm:', error);
        throw error;
      }
    }
    return this.realm;
  }

  // 创建 Cargo
  async createCargo(cargoData: CargoData) {
    const realm = await this.getRealm();
    try {
      const cargoId = uuid.v4().toString(); // 使用 react-native-uuid 生成 UUID 作为主键
      const quantity = cargoData.quantity || 0;

      realm.write(() => {
        realm.create('Cargo', {
          ...cargoData,
          cargoId,
          quantity,
          ctime: new Date(),
          utime: new Date(),
        });
      });
      console.log('Cargo added!');
    } catch (error) {
      console.error('Failed to create cargo:', error);
    }
  }

  // 获取所有 Cargo
  async getAllCargo() {
    const realm = await this.getRealm();
    try {
      return Array.from(realm.objects('Cargo'));
    } catch (error) {
      console.error('Failed to fetch cargos:', error);
      return [];
    }
  }

  // 通过 cargoId 获取单个 Cargo
  async getCargoById(cargoId: string): Promise<CargoData | null> {
    const realm = await this.getRealm();
    try {
      const cargo = realm.objectForPrimaryKey('Cargo', cargoId) as CargoData;
      if (cargo) {
        return {
          name: cargo.name,
          category: cargo.category,
          quantity: cargo.quantity,
          unit: cargo.unit,
          description: cargo.description,
          ctime: cargo.ctime,
          utime: cargo.utime,
        };
      } else {
        console.log('Cargo not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch cargo by id:', error);
      return null;
    }
  }

  // 更新 Cargo
  async updateCargo(cargoId: string, cargoData: CargoData) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargo = realm.objectForPrimaryKey('Cargo', cargoId);
        if (cargo) {
          cargo.name = cargoData.name;
          cargo.category = cargoData.category;
          cargo.quantity = cargoData.quantity;
          cargo.unit = cargoData.unit;
          cargo.description = cargoData.description;
          cargo.utime = new Date();
        }
      });
      console.log('Cargo updated!');
    } catch (error) {
      console.error('Failed to update cargo:', error);
    }
  }

  // 删除 Cargo
  async deleteCargo(cargoId: string) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargo = realm.objectForPrimaryKey('Cargo', cargoId);
        if (cargo) {
          realm.delete(cargo);
        }
      });
      console.log('Cargo deleted!');
    } catch (error) {
      console.error('Failed to delete cargo:', error);
    }
  }

  // 批量删除 Cargo
  async deleteMultipleCargo(status: string) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargos = realm.objects('Cargo').filtered('status == $0', status);
        realm.delete(cargos);
      });
      console.log(`Deleted all cargos with status "${status}"`);
    } catch (error) {
      console.error('Failed to delete multiple cargos:', error);
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

export const cargoRepository = new CargoRepository();
