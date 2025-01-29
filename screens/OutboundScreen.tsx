import React, {useState} from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Divider from '../components/Divider';
import SectionInput from '../components/SectionInput'; // 假设 Section 组件已存在
import {useRealm, useQuery} from '@realm/react'; // 引入 Realm hooks
import {Cargo} from '../models/Cargo'; // 导入 Cargo 模型

export default function OutboundScreen({navigation}: any) {
  const [selectedCargo, setSelectedCargo] = useState<string>(''); // 当前选择的货物
  const realm = useRealm();

  // 使用 Realm 查询所有货物数据
  const cargoList = useQuery(Cargo);

  // 获取货物列表
  const fetchCargoList = () => {
    try {
      return cargoList;
    } catch (error) {
      console.error('Failed to fetch cargo list:', error);
    }
  };

  // 处理出库操作
  const handleOutbound = () => {
    if (!selectedCargo) {
      Alert.alert('Error', 'Please select a cargo');
      return;
    }

    const cargoToOutbound = cargoList.filtered(`name == "${selectedCargo}"`)[0];
    if (cargoToOutbound) {
      // 这里可以执行出库的操作，例如减少库存
      console.log(`出库货物: ${selectedCargo}`);
      Alert.alert('成功', `已出库货物: ${selectedCargo}`);
    } else {
      Alert.alert('Error', 'Cargo not found');
    }
  };

  // 处理删除货物
  const handleDeleteCargo = () => {
    if (!selectedCargo) {
      Alert.alert('Error', 'Please select a cargo');
      return;
    }

    const cargoToRemove = cargoList.filtered(`name == "${selectedCargo}"`)[0];
    if (!cargoToRemove) {
      Alert.alert('Error', 'Cargo not found');
      return;
    }

    // 执行删除操作
    try {
      realm.write(() => {
        realm.delete(cargoToRemove);
      });
      Alert.alert('成功', `删除货物: ${selectedCargo}`);
    } catch (error) {
      console.error('删除货物时出错：', error);
      Alert.alert('Error', '删除货物时出错');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>货物出库</Text>

      {/* 货物选择 */}
      <SectionInput label="货物选择">
        <RNPickerSelect
          placeholder={{label: '请选择货物', value: ''}}
          value={selectedCargo}
          onValueChange={setSelectedCargo}
          items={
            fetchCargoList()?.map(cargo => ({
              label: cargo.name,
              value: cargo.name,
            })) || []
          }
          style={pickerSelectStyles}
        />
      </SectionInput>

      {/* 确认出库按钮 */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleOutbound}>
        <Text style={styles.addButtonText}>确认出库</Text>
      </TouchableOpacity>

      <Divider />

      {/* 删除货物按钮 */}
      <TouchableOpacity style={styles.addButton} onPress={handleDeleteCargo}>
        <Text style={styles.addButtonText}>删除货物</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#208eff', // 蓝色，表示出库
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#FF5722', // 红色，表示删除
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
});
