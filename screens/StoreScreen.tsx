import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Divider from '../components/Divider';
import ModelFlatItem from '../components/ModelFlatItem'; // 引入 ModelFlatItem
import SectionInput from '../components/SectionInput';
import {useCargo} from '../hooks/useCargo';
import {colorStyle} from '../styles';
import {BSON} from 'realm';
import {useCargoItem} from '../hooks/useCargoItem';

export default function StoreScreen({navigation}: any) {
  const [cargoCategory, setCargoCategory] = useState<string>(''); // 当前选择的货物类别
  const [selectedCargo, setSelectedCargo] = useState<string>(''); // 当前选择的货物
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // 当前选择的货物索引
  const [filteredCargoList, setFilteredCargoList] = useState<any[]>([]); // 存储筛选后的货物

  // 使用 Realm 查询所有货物数据
  const {cargoList, updateCargoItemQuantity} = useCargo();
  const currentCargo = useMemo(() => {
    if (selectedIndex > 0) {
      return cargoList[selectedIndex - 1];
    }
    return null;
  }, [selectedIndex, cargoList]);

  // 根据货物类别筛选货物
  const filterCargoByCategory = useCallback(() => {
    if (!cargoCategory) {
      setFilteredCargoList(Array.from(cargoList)); // 如果没有选择类别，显示所有货物
    } else {
      const filtered = cargoList.filtered(`category == "${cargoCategory}"`);
      setFilteredCargoList(Array.from(filtered)); // 筛选出符合类别的货物
    }
  }, [cargoList, cargoCategory]);

  useEffect(() => {
    filterCargoByCategory(); // 组件挂载时默认筛选
  }, [cargoCategory, cargoList]);

  const handleQuantityChange = (id: BSON.ObjectId, newQuantity: number) => {
    if (currentCargo) {
      updateCargoItemQuantity(currentCargo._id, id, newQuantity);
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={filteredCargoList}
      keyExtractor={item => item._id.toString()}
      ListHeaderComponent={
        <>
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
              onValueChange={(value, index) => {
                console.log('select:', value, index);
                setSelectedCargo(value);
                setSelectedIndex(index);
              }}
              items={filteredCargoList.map(cargo => ({
                label: cargo.name,
                value: cargo.name,
              }))}
              style={pickerSelectStyles}
            />
          </SectionInput>

          <Divider />

          {/* 当前选中货物的 items 内容展示 */}
          {currentCargo && currentCargo.items.length > 0 ? (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>当前选中货物的型号:</Text>
              <FlatList
                data={currentCargo.items}
                keyExtractor={item => item._id.toString()}
                renderItem={({item}) => (
                  <ModelFlatItem
                    item={item}
                    onQuantityChange={handleQuantityChange}
                  />
                )}
              />
            </View>
          ) : (
            <Text style={styles.noItemsText}>当前货物没有型号信息</Text>
          )}

          <Divider />

          {/* 添加新货物按钮 */}
          <TouchableOpacity
            style={styles.addCargoButton}
            onPress={() => navigation.navigate('AddCargo')}>
            <Text style={styles.buttonText}>添加新货物</Text>
          </TouchableOpacity>

          {/* 添加新型号按钮 */}
          <TouchableOpacity
            style={styles.addModelButton}
            onPress={() => navigation.navigate('AddModel')}>
            <Text style={styles.buttonText}>添加新型号</Text>
          </TouchableOpacity>
        </>
      }
      renderItem={({item}) => null} // FlatList 不需要渲染每个货物项
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
  addCargoButton: {
    backgroundColor: colorStyle.success,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addModelButton: {
    backgroundColor: colorStyle.warning,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  itemsContainer: {
    marginVertical: 20,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 16,
    color: '#888',
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
