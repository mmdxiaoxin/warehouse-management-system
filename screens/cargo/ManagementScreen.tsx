import {Button, Divider} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import ModelFlatItem from '../../components/ModelFlatItem';
import FormItem from '../../components/FormItem';
import {useCargo} from '../../hooks/useCargo';
import {useModel} from '../../hooks/useModel';
import {CargoScreenProps} from '../../routes/types';
import {pickerSelectStyles} from '../../styles';

export default function ManagementScreen({
  navigation,
  route,
}: CargoScreenProps) {
  const [cargoCategory, setCargoCategory] = useState<string>('');
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>();

  const {cargoList} = useCargo();
  const {deleteModel, updateModel} = useModel();

  const handleQuantityChange = (id: BSON.ObjectId, newQuantity: number) => {
    if (selectedCargo) {
      const currentCargo = cargoList.find(cargo =>
        cargo._id.equals(selectedCargo),
      );
      if (currentCargo) {
        updateModel(currentCargo._id, id, {quantity: newQuantity});
      }
    }
  };

  const handleEditModel = (id: BSON.ObjectId) => {
    if (!selectedCargo) {
      Alert.alert('错误', '未选择货物');
      return;
    }

    navigation.navigate('EditModel', {
      cargoId: selectedCargo.toHexString(),
      cargoItemId: id.toHexString(),
    });
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
          if (!selectedCargo) {
            Alert.alert('错误', '未选择货物');
            return;
          }

          deleteModel(selectedCargo, id);
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
          <FormItem inline label="货物类别">
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
          </FormItem>

          {/* 选择货物 */}
          <FormItem inline label="货物选择">
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
          </FormItem>

          {/* 添加新货物按钮 */}
          <Button
            title="添加新货物"
            onPress={() => navigation.navigate('AddCargo')}
            color="success"
          />

          <Divider width={1} style={{marginVertical: 10}} />

          {/* 当前选中货物的 items 内容展示 */}
          {selectedCargo && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>当前选中货物的型号:</Text>
              {filterCargoByCategory()
                .filter(cargo => cargo._id.equals(selectedCargo))
                .map(cargo =>
                  cargo.models.length > 0 ? (
                    <FlatList
                      key={cargo._id.toString()}
                      data={cargo.models}
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
                  ) : (
                    <Text key={cargo._id.toString()} style={styles.noItemsText}>
                      当前货物下没有型号
                    </Text>
                  ),
                )}
            </View>
          )}

          {!selectedCargo && (
            <Text style={styles.noItemsText}>请选择一个货物</Text>
          )}

          {/* 添加新型号按钮 */}
          {selectedCargo && (
            <Button
              title="添加新型号"
              onPress={() => {
                if (selectedCargo) {
                  navigation.navigate('AddModel', {
                    cargoId: selectedCargo.toHexString(),
                  });
                } else {
                  navigation.navigate('AddModel');
                }
              }}
              buttonStyle={{marginBottom: 40}}
              color="warning"
            />
          )}
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
    textAlign: 'center',
  },
});
