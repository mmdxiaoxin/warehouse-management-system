import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Divider from '../components/Divider';
import {cargoRepository} from '../models/CargoRepository';

export default function OutboundScreen({navigation}: any) {
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储货物种类
  const [selectedCargo, setSelectedCargo] = useState<string>(''); // 当前选择的货物

  const fetchCargoList = async () => {
    try {
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(cargos);
    } catch (error) {
      console.error('Failed to fetch cargo list:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCargoList();
    }, []),
  );

  const handleOutbound = () => {};

  const handleDeleteCargo = () => {
    if (!selectedCargo) {
      Alert.alert('Error', 'Please select a cargo');
      return;
    }

    const cargoToRemove = cargoList.find(cargo => cargo.name === selectedCargo);

    if (!cargoToRemove) {
      Alert.alert('Error', 'Cargo not found');
      return;
    }

    // TODO: 删除货物操作
    Alert.alert('成功', `删除货物: ${selectedCargo} `);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>货物出库</Text>

      <Text style={styles.label}>货物选择:</Text>
      <RNPickerSelect
        placeholder={{label: '请选择货物', value: ''}}
        value={selectedCargo}
        onValueChange={setSelectedCargo}
        items={cargoList.map(cargo => ({
          label: cargo.name,
          value: cargo.name,
        }))}
        style={pickerSelectStyles}
      />

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
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
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
