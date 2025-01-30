import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import Divider from '../components/Divider';
import ModelFlatItem from '../components/ModelFlatItem'; // 引入 ModelFlatItem
import SectionInput from '../components/SectionInput';
import {useCargo} from '../hooks/useCargo';
import {colorStyle} from '../styles';
import {useObject} from '@realm/react';

export default function StoreScreen({navigation}: any) {
  const [cargoCategory, setCargoCategory] = useState<string>(''); // 当前选择的货物类别
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>(
    null,
  ); // 当前选择的货物ID

  // 使用 Realm 查询所有货物数据
  const {cargoList, updateCargoItemQuantity} = useCargo();

  const handleQuantityChange = (id: BSON.ObjectId, newQuantity: number) => {
    if (selectedCargo) {
      const currentCargo = cargoList.find(cargo =>
        cargo._id.equals(selectedCargo),
      );
      if (currentCargo) {
        updateCargoItemQuantity(currentCargo._id, id, newQuantity);
      }
    }
  };

  const handleEditModel = (id: BSON.ObjectId) => {
    // TODO: 编辑型号
  };

  const handleDeleteModel = (id: BSON.ObjectId) => {
    // TODO: 删除型号
  };

  // 根据货物类别筛选货物
  const filterCargoByCategory = () => {
    if (!cargoCategory) {
      return cargoList; // 如果没有选择类别，显示所有货物
    } else {
      return cargoList.filtered(`category == "${cargoCategory}"`);
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={filterCargoByCategory()} // 直接使用过滤后的货物数据
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
              value={selectedCargo ? selectedCargo.toString() : ''}
              onValueChange={value => {
                const cargoId = value ? new BSON.ObjectId(value) : null;
                setSelectedCargo(cargoId);
              }}
              items={filterCargoByCategory().map(cargo => ({
                label: cargo.name,
                value: cargo._id.toString(),
              }))}
              style={pickerSelectStyles}
            />
          </SectionInput>

          <Divider />

          {/* 当前选中货物的 items 内容展示 */}
          {selectedCargo && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>当前选中货物的型号:</Text>
              {filterCargoByCategory().map(cargo => (
                <FlatList
                  key={cargo._id.toString()}
                  data={cargo.items}
                  keyExtractor={item => item._id.toString()}
                  renderItem={({item}) => (
                    <ModelFlatItem
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onEdit={handleEditModel}
                      onDelete={handleDeleteModel}
                    />
                  )}
                />
              ))}
            </View>
          )}

          {!selectedCargo && (
            <Text style={styles.noItemsText}>请选择一个货物</Text>
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
