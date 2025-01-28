import React, {useEffect, useState} from 'react';
import {View, Text, Button, SectionList, Alert, StyleSheet} from 'react-native';
import {cargoRepository} from '../models/CargoRepository';
import RNFS from 'react-native-fs';
import CargoItem from '../components/CargoItem';
import {useFocusEffect} from '@react-navigation/native';

export default function InventoryScreen() {
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储货物列表

  useFocusEffect(
    React.useCallback(() => {
      // 获取所有货物
      const loadCargoData = async () => {
        const cargos = await cargoRepository.getAllCargo();
        setCargoList(cargos as any[]);
      };

      const deleteRealmDatabase = async () => {
        const realmPath = `${RNFS.DocumentDirectoryPath}/cargo.realm`; // 默认路径
        try {
          // 删除数据库文件
          await RNFS.unlink(realmPath);
          console.log('Realm database file deleted successfully!');
        } catch (error) {
          console.error('Error deleting Realm database:', error);
        }
      };

      // deleteRealmDatabase(); // 用来删除数据库文件进行测试
      loadCargoData();
    }, []),
  );

  // 按照类别进行分组
  const groupByCategory = (cargoList: any[]) => {
    const grouped: {title: string; data: any[]}[] = [];
    const categories = Array.from(
      new Set(cargoList.map(cargo => cargo.category)),
    );

    categories.forEach(category => {
      const filteredCargo = cargoList.filter(
        cargo => cargo.category === category,
      );
      grouped.push({
        title: category,
        data: filteredCargo,
      });
    });

    return grouped;
  };

  // 处理货物删除操作
  const handleDeleteCargo = (cargoId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this cargo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await cargoRepository.deleteCargo(cargoId);
              setCargoList(prevCargoList =>
                prevCargoList.filter(cargo => cargo.cargoId !== cargoId),
              ); // 更新列表
              console.log('Cargo deleted!');
            } catch (error) {
              console.error('Error deleting cargo:', error);
            }
          },
        },
      ],
    );
  };

  // 处理货物状态更新
  const handleUpdateStatus = async (cargoId: string, newStatus: string) => {
    try {
      await cargoRepository.updateCargoStatus(cargoId, newStatus);
      setCargoList(prevCargoList =>
        prevCargoList.map(cargo =>
          cargo.cargoId === cargoId ? {...cargo, status: newStatus} : cargo,
        ),
      );
      console.log('Cargo status updated!');
    } catch (error) {
      console.error('Error updating cargo status:', error);
    }
  };

  // 处理创建货物
  const handleCreateCargo = async () => {
    try {
      const newCargo = {
        name: 'Furniture',
        description: 'Chairs and tables',
        category: '木门',
        weight: 25.5,
        volume: 0.08,
        origin: 'Beijing',
        destination: 'Los Angeles',
        shippingDate: new Date('2025-01-25'),
        estimatedArrival: new Date('2025-02-05'),
        status: 'Pending',
        trackingNumber: 'TN987654321',
      };

      await cargoRepository.createCargo(newCargo); // 创建货物

      // 重新获取并更新货物列表
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(
        cargos.map(cargo => ({
          ...cargo,
          cargoId: String(cargo.cargoId), // 确保 cargoId 是字符串类型
        })),
      );
    } catch (error) {
      console.error('Error creating cargo:', error);
    }
  };

  const groupedCargo = groupByCategory(cargoList);

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Cargo Management</Text>
      <Button title="Create Cargo" onPress={handleCreateCargo} />

      {/* 使用 SectionList 展示分组的货物 */}
      <SectionList
        sections={groupedCargo}
        keyExtractor={(item, index) => String(item.cargoId) + index} // 使用 cargoId 和 index 作为 key
        renderItem={({item}) => (
          <CargoItem
            item={item}
            handleUpdateStatus={handleUpdateStatus}
            handleDeleteCargo={handleDeleteCargo}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
});
