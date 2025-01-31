import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import CustomButton from '../components/CustomButton'; // 引入自定义按钮
import Divider from '../components/Divider';
import ModelFlatItem from '../components/ModelFlatItem';
import SectionInput from '../components/SectionInput';
import {useCargo} from '../hooks/useCargo';
import {useCargoItem} from '../hooks/useCargoItem';

export default function ManagementScreen({navigation}: any) {
  const [cargoCategory, setCargoCategory] = useState<string>('');
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>(
    null,
  );

  const {cargoList, updateCargoItemQuantity} = useCargo();
  const {deleteCargoItem} = useCargoItem();

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
    Alert.alert('删除型号', '确定要删除这个型号吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        onPress: () => {
          if (selectedCargo) {
            const currentCargo = cargoList.find(cargo =>
              cargo._id.equals(selectedCargo),
            );
            if (currentCargo) {
              deleteCargoItem(id);
            }
          }
        },
      },
    ]);
  };

  const filterCargoByCategory = () => {
    if (!cargoCategory) {
      return cargoList;
    } else {
      return cargoList.filtered(`category == "${cargoCategory}"`);
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={filterCargoByCategory()}
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

          {/* 添加新货物按钮 */}
          <CustomButton
            title="添加新货物"
            onPress={() => navigation.navigate('AddCargo')}
            buttonStyle={styles.addCargoButton}
            type="success"
          />

          <Divider />

          {/* 当前选中货物的 items 内容展示 */}
          {selectedCargo && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>当前选中货物的型号:</Text>
              {filterCargoByCategory()
                .filter(cargo => cargo._id.equals(selectedCargo))
                .map(cargo => (
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

          {/* 添加新型号按钮 */}
          <CustomButton
            title="添加新型号"
            onPress={() => {
              if (selectedCargo) {
                navigation.navigate('AddModel', {selectedCargo});
              } else {
                navigation.navigate('AddModel');
              }
            }}
            buttonStyle={styles.addModelButton}
            type="warning"
          />
        </>
      }
      renderItem={({item}) => null}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  addCargoButton: {},
  addModelButton: {
    marginBottom: 40,
  },
  itemsContainer: {
    marginTop: 20,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
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
