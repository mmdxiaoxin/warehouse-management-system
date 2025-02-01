import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import AdvancedButton from '../components/AdvancedButton';
import CargoSpecInput, {CargoSpec} from '../components/CargoSpecInput';
import Divider from '../components/Divider';
import SectionInput from '../components/SectionInput';
import {useCargo} from '../hooks/useCargo';
import {useCargoItem} from '../hooks/useCargoItem';
import {AddModelProps} from '../routes/types';
import {fontStyle, pickerSelectStyles} from '../styles';
import {stringifyWithOrder} from '../utils';

export default function AddModelScreen({navigation, route}: AddModelProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);
  // 使用 Realm 查询所有货物数据
  const {cargoList} = useCargo();
  const {createCargoItem} = useCargoItem();

  const [cargoCategory, setCargoCategory] = useState<string>(''); // 当前选择的货物类别
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId>(cargoId); // 当前选择的货物
  const [filteredCargoList, setFilteredCargoList] = useState<any[]>([]); // 存储筛选后的货物
  const [spec, setSpec] = useState<CargoSpec>([]); // 货物规格

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

    if (spec.length === 0) {
      Alert.alert('请输入货物规格');
      return;
    }

    const newModels = stringifyWithOrder(spec);

    if (
      cargoList
        .find(cargo => cargo._id.equals(selectedCargo))
        ?.items.find(item => item.models === newModels)
    ) {
      Alert.alert('型号重复', '您已经添加过相同的型号了!');
      return;
    }

    // 增加新型号
    const modelId = createCargoItem(selectedCargo, {
      quantity: 0,
      models: newModels,
    });

    if (modelId) {
      Alert.alert('型号添加成功', '您已成功添加了一个新型号', [
        {
          text: '继续添加',
          onPress: () => {
            setSelectedCargo(cargoId);
            setSpec([]);
          },
        },
        {
          text: '返回仓管',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
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
            {label: '门', value: '门'},
            {label: '地板', value: '地板'},
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
      <CargoSpecInput specifications={spec} onChange={setSpec} />

      {/* 确认添加按钮 */}
      <AdvancedButton
        title="确认添加"
        onPress={handleAddToStore}
        disabled={spec.length === 0 || !selectedCargo}
        buttonStyle={styles.confirmButton}
      />

      {/* 取消按钮 */}
      <AdvancedButton
        title="取消添加"
        onPress={() => navigation.goBack()}
        type="warning"
        buttonStyle={styles.cancelButton}
      />
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
  confirmButton: {
    marginVertical: 10,
  },
  cancelButton: {
    marginBottom: 40,
  },
});
