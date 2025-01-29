import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import CargoSpecInput from '../components/CargoSpecInput';
import Divider from '../components/Divider';
import SectionInput from '../components/SectionInput';
import {cargoRepository} from '../models/CargoRepository';
import {colorStyle} from '../styles';

export default function StoreScreen({navigation}: any) {
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储所有货物
  const [filteredCargoList, setFilteredCargoList] = useState<any[]>([]); // 存储筛选后的货物
  const [cargoCategory, setCargoCategory] = useState<string>(''); // 当前选择的货物类别
  const [selectedCargo, setSelectedCargo] = useState<string>(''); // 当前选择的货物

  // 获取所有货物列表
  const fetchCargoList = async () => {
    try {
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(cargos);
    } catch (error) {
      console.error('Failed to fetch cargo list:', error);
    }
  };

  // 根据货物类别筛选货物
  const filterCargoByCategory = useCallback(() => {
    if (!cargoCategory) {
      setFilteredCargoList(cargoList); // 如果没有选择类别，显示所有货物
    } else {
      const filtered = cargoList.filter(
        cargo => cargo.category === cargoCategory,
      );
      setFilteredCargoList(filtered); // 筛选出符合类别的货物
    }
  }, [cargoList, cargoCategory]);

  useEffect(() => {
    filterCargoByCategory(); // 组件挂载时默认筛选
  }, [cargoCategory, cargoList]);

  useFocusEffect(
    useCallback(() => {
      fetchCargoList(); // 获取货物列表
    }, []),
  );

  const handleAddToStore = () => {
    // 入库逻辑
    console.log('已选择货物:', selectedCargo);
    console.log('货物规格:', cargoCategory);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>货物入库</Text>

      <SectionInput label="货物类别">
        <RNPickerSelect
          placeholder={{label: '请选择种类', value: ''}}
          value={cargoCategory}
          onValueChange={setCargoCategory}
          items={[
            {label: '木门', value: '木门'},
            {label: '木地板', value: '木地板'},
            {label: '辅料', value: '辅料'},
          ]}
          style={pickerSelectStyles}
        />
      </SectionInput>

      <SectionInput label="货物选择">
        <RNPickerSelect
          placeholder={{label: '请选择货物', value: ''}}
          value={selectedCargo}
          onValueChange={setSelectedCargo}
          items={filteredCargoList.map(cargo => ({
            label: cargo.name,
            value: cargo.name,
          }))}
          style={pickerSelectStyles}
        />
      </SectionInput>

      <Divider />

      <CargoSpecInput onChange={() => {}} />

      {/* 入库按钮 */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleAddToStore}>
        <Text style={styles.addButtonText}>确认入库</Text>
      </TouchableOpacity>

      <Divider />

      {/* 添加新货物按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCargo')}>
        <Text style={styles.addButtonText}>添加新货物</Text>
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: colorStyle.primary,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: colorStyle.success,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    marginBottom: 40,
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
