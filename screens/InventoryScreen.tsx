import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {cargoRepository} from '../models/CargoRepository'; // 引入仓库类

export default function InventoryScreen() {
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储货物列表

  useEffect(() => {
    // 获取所有货物
    const loadCargoData = async () => {
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(cargos as any[]);
    };

    loadCargoData();
  }, []);

  // 处理货物删除操作
  const handleDeleteCargo = (cargoId: number) => {
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
            await cargoRepository.deleteCargo(cargoId);
            setCargoList(prevCargoList =>
              prevCargoList.filter(cargo => cargo.cargoId !== cargoId),
            ); // 更新列表
            console.log('Cargo deleted!');
          },
        },
      ],
    );
  };

  // 处理货物状态更新
  const handleUpdateStatus = async (cargoId: number, newStatus: string) => {
    await cargoRepository.updateCargoStatus(cargoId, newStatus);
    setCargoList(prevCargoList =>
      prevCargoList.map(cargo =>
        cargo.cargoId === cargoId ? {...cargo, status: newStatus} : cargo,
      ),
    );
    console.log('Cargo status updated!');
  };

  // 处理创建货物
  const handleCreateCargo = async () => {
    const newCargo = {
      cargoId: 2,
      name: 'Furniture',
      description: 'Chairs and tables',
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
    setCargoList(cargos as any[]);
  };

  // 渲染货物项
  const renderCargoItem = ({item}: {item: any}) => (
    <View
      style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
      <Text>Name: {item.name}</Text>
      <Text>Status: {item.status}</Text>
      <Text>
        Origin: {item.origin} - Destination: {item.destination}
      </Text>
      <Text>Shipping Date: {item.shippingDate.toLocaleDateString()}</Text>
      <Text>
        Estimated Arrival: {item.estimatedArrival.toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={{marginTop: 10, backgroundColor: '#4CAF50', padding: 10}}
        onPress={() => handleUpdateStatus(item.cargoId, 'Shipped')}>
        <Text style={{color: '#fff'}}>Mark as Shipped</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginTop: 10, backgroundColor: '#f44336', padding: 10}}
        onPress={() => handleDeleteCargo(item.cargoId)}>
        <Text style={{color: '#fff'}}>Delete Cargo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Cargo Management</Text>
      <Button title="Create Cargo" onPress={handleCreateCargo} />
      <FlatList
        data={cargoList}
        renderItem={renderCargoItem} // 渲染货物项
        keyExtractor={item => item.cargoId.toString()} // 唯一标识符
      />
    </View>
  );
}
