import {useObject} from '@realm/react';
import {Button, SpeedDial} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import FormItem from '../../components/FormItem';
import {useCargo} from '../../hooks/useCargo';
import {useCategory} from '../../hooks/useCategory';
import {useUnit} from '../../hooks/useUnit';
import {Cargo} from '../../models/Cargo';
import {EditCargoProps} from '../../routes/types';
import {pickerSelectStyles} from '../../styles';

export default function EditCargo({navigation, route}: EditCargoProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);

  const {updateCargo} = useCargo();
  const {categories} = useCategory();
  const {units} = useUnit();

  const foundCargo = useObject(Cargo, cargoId);

  const [newCargoName, setNewCargoName] = useState(foundCargo?.name || '');
  const [newCargoCategory, setNewCargoCategory] = useState(
    foundCargo?.category || '',
  );
  const [newCargoUnit, setNewCargoUnit] = useState(foundCargo?.unit || '个');
  const [newCargoDescription, setNewCargoDescription] = useState(
    foundCargo?.description || '',
  );
  const [newPrice, setNewPrice] = useState(foundCargo?.price?.toString() || '');
  const [newBrand, setNewBrand] = useState(foundCargo?.brand || '');
  const [open, setOpen] = useState(false);

  // 校验输入数据
  const handleSaveCargo = async () => {
    if (!newCargoName.trim()) {
      Alert.alert('请输入货物名称');
      return;
    }

    try {
      if (!foundCargo) {
        throw new Error('货物数据不存在');
      }

      updateCargo(foundCargo._id, {
        name: newCargoName,
        category: newCargoCategory,
        unit: newCargoUnit,
        description: newCargoDescription,
        price: newPrice ? parseFloat(newPrice) : undefined,
        brand: newBrand,
      });
      navigation.goBack();
    } catch (error) {
      console.error('更新货物失败:', error);
      Alert.alert('更新货物失败，请重试！');
    }
  };

  if (!foundCargo) {
    return <Text>加载货物信息...</Text>; // 如果 cargo 数据未加载完成，显示加载信息
  }

  return (
    <View style={styles.container}>
      {/* 货物名称 */}
      <FormItem
        inline
        label="货物名称"
        value={newCargoName}
        onChangeText={setNewCargoName}
        placeholder="请输入货物名称"
      />

      {/* 货物类别 */}
      <FormItem inline label="货物类别">
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          value={newCargoCategory}
          onValueChange={setNewCargoCategory}
          items={categories.map(category => ({
            label: category.name,
            value: category.name,
          }))}
          style={pickerSelectStyles}
        />
      </FormItem>

      {/* 货物单位 */}
      <FormItem inline label="货物单位">
        <RNPickerSelect
          placeholder={{label: '请选择货物单位', value: ''}}
          value={newCargoUnit}
          onValueChange={setNewCargoUnit}
          useNativeAndroidPickerStyle={false}
          items={units.map(unit => ({
            label: unit.name,
            value: unit.name,
          }))}
          style={pickerSelectStyles}
        />
      </FormItem>

      <FormItem
        inline
        label="价格"
        placeholder="请输入价格(可选)"
        value={newPrice}
        onChangeText={setNewPrice}
      />

      <FormItem
        inline
        label="品牌"
        placeholder="请输入品牌(可选)"
        value={newBrand}
        onChangeText={setNewBrand}
      />

      <FormItem
        inline
        label="备注"
        placeholder="请输入备注(可选)"
        value={newCargoDescription}
        onChangeText={setNewCargoDescription}
      />

      {/* 保存按钮 */}
      <Button
        title="保存"
        onPress={handleSaveCargo}
        color="success"
        buttonStyle={{marginBottom: 10}}
      />

      {/* 取消按钮 */}
      <Button
        title="取消"
        onPress={() => navigation.goBack()}
        color="warning"
        buttonStyle={{marginBottom: 10}}
      />

      <SpeedDial
        isOpen={open}
        icon={{name: 'plus', color: '#fff', type: 'antdesign'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          icon={{
            name: 'folder-open',
            color: '#fff',
            type: 'font-awesome',
            size: 20,
            style: {marginLeft: 2, marginTop: 2},
          }}
          title="新增类别"
          onPress={() => navigation.navigate('AddCategory')}
        />
        <SpeedDial.Action
          icon={{
            name: 'balance-scale',
            color: '#fff',
            type: 'font-awesome',
            size: 20,
          }}
          title="新增单位"
          onPress={() => navigation.navigate('AddUnit')}
        />
      </SpeedDial>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
