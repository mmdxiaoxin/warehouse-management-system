import Realm from 'realm';
import {Cargo} from './CargoModel';

class CargoRepository {
  private realm: Realm | null = null;

  // 打开 Realm 数据库
  private async getRealm() {
    if (!this.realm) {
      this.realm = await Realm.open({
        path: 'cargo.realm',
        schema: [Cargo],
      });
    }
    return this.realm;
  }

  // 创建 Cargo
  async createCargo(cargoData: {
    cargoId: number;
    name: string;
    description?: string;
    weight: number;
    volume?: number;
    origin: string;
    destination: string;
    shippingDate: Date;
    estimatedArrival: Date;
    status: string;
    trackingNumber?: string;
  }) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        realm.create('Cargo', cargoData);
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
      return realm.objects('Cargo');
    } catch (error) {
      console.error('Failed to fetch cargos:', error);
      return [];
    }
  }

  // 根据状态获取 Cargo
  async getCargoByStatus(status: string) {
    const realm = await this.getRealm();
    try {
      return realm.objects('Cargo').filtered('status == $0', status);
    } catch (error) {
      console.error(`Failed to fetch cargos with status "${status}":`, error);
      return [];
    }
  }

  // 更新 Cargo 状态
  async updateCargoStatus(cargoId: number, newStatus: string) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargo = realm.objectForPrimaryKey('Cargo', cargoId);
        if (cargo) {
          cargo.status = newStatus;
        }
      });
      console.log('Cargo status updated!');
    } catch (error) {
      console.error('Failed to update cargo status:', error);
    }
  }

  // 批量更新 Cargo 状态
  async updateMultipleCargoStatus(status: string, newStatus: string) {
    const realm = await this.getRealm();
    try {
      realm.write(() => {
        const cargos = realm.objects('Cargo').filtered('status == $0', status);
        cargos.forEach(cargo => {
          cargo.status = newStatus;
        });
      });
      console.log(
        `Updated status of cargos with status "${status}" to "${newStatus}"`,
      );
    } catch (error) {
      console.error('Failed to update multiple cargos status:', error);
    }
  }

  // 删除 Cargo
  async deleteCargo(cargoId: number) {
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
