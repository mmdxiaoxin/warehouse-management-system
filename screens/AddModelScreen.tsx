import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import CargoSpecInput, {CargoSpec} from '../components/CargoSpecInput';
import Divider from '../components/Divider';
import SectionInput from '../components/SectionInput';
import {useCargo} from '../hooks/useCargo';
import {useCargoItem} from '../hooks/useCargoItem';
import {RootStackParamList} from '../routes';
import {colorStyle, fontStyle} from '../styles';

export default function AddModelScreen({navigation}: any) {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const cargoId = new BSON.ObjectId(route.params?.cargoId);

  const [cargoCategory, setCargoCategory] = useState<string>(''); // 当前选择的货物类别
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId>(cargoId); // 当前选择的货物
  const [filteredCargoList, setFilteredCargoList] = useState<any[]>([]); // 存储筛选后的货物
  const [spec, setSpec] = useState<CargoSpec>([]); // 货物规格

  // 使用 Realm 查询所有货物数据
  const {cargoList} = useCargo();
  const {createCargoItem} = useCargoItem();

  useEffect(() => {
    if (!cargoCategory) {
      setFilteredCargoList(Array.from(cargoList)); // 如果没有选择类别，显示所有货物
    } else {
      const filtered = cargoList.filtered(`category == "${cargoCategory}"`);
      setFilteredCargoList(Array.from(filtered)); // 筛选出符合类别的货物
    }
  }, [cargoCategory, cargoList]);

  // 入库逻辑
  const handleAddToStore = () => {
    if (!selectedCargo) {
      Alert.alert('请选择货物');
      return;
    }

    // 增加库存逻辑（例如增加数量）
    createCargoItem(selectedCargo, {
      quantity: 1,
      models: JSON.stringify(spec),
    });

    navigation.goBack();

    Alert.alert(`已成功添加型号!`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>添加新型号</Text>

      {/* 选择货物类别 */}
      <SectionInput label="货物类别">
        <RNPickerSelect
          placeholder={{label: '请选择种类(可不选)', value: ''}}
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

      {/* 选择货物 */}
      <SectionInput label="货物选择">
        <RNPickerSelect
          placeholder={{label: '请选择货物', value: ''}}
          value={selectedCargo}
          onValueChange={value => {
            setSelectedCargo(value);
          }}
          items={filteredCargoList.map(cargo => ({
            label: cargo.name,
            value: cargo._id,
          }))}
          style={pickerSelectStyles}
        />
      </SectionInput>

      <Divider />

      {/* 货物规格输入 */}
      <CargoSpecInput onChange={setSpec} />

      {/* 入库按钮 */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleAddToStore}>
        <Text style={styles.confirmButtonText}>型号添加</Text>
      </TouchableOpacity>

      {/* 取消按钮 */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.confirmButtonText}>取消添加</Text>
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
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
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
  cancelButton: {
    backgroundColor: colorStyle.danger,
    padding: 10,
    borderRadius: 5,
    marginBottom: 40,
  },
  confirmButtonText: {
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
