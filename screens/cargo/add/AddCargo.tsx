import {Button, SpeedDial} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, StyleSheet, ToastAndroid, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import FormItem from '../../../components/FormItem'; // 假设Section组件已经在项目中
import {useBrand} from '../../../hooks/useBrand';
import {useCargo} from '../../../hooks/useCargo';
import {useCategory} from '../../../hooks/useCategory';
import {useUnit} from '../../../hooks/useUnit';
import {AddCargoProps} from '../../../routes/types';
import {pickerSelectStyles} from '../../../styles';

export default function AddCargo({navigation}: AddCargoProps) {
  const [newName, setNewCargoName] = useState('');
  const [newCategory, setNewCargoCategory] = useState<
    BSON.ObjectId | undefined
  >();
  const [newUnit, setNewCargoUnit] = useState<BSON.ObjectId | undefined>();
  const [newBrand, setNewBrand] = useState<BSON.ObjectId | undefined>();
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewCargoDescription] = useState('');

  const [open, setOpen] = useState(false);

  const {createCargo} = useCargo();
  const {categories} = useCategory();
  const {units} = useUnit();
  const {brands} = useBrand();

  // 处理添加货物
  const handleAdd = async () => {
    try {
      // 校验输入字段是否为空
      if (!newName.trim()) {
        throw new Error('货物名称不能为空!');
      }

      // 校验价格是否为数字
      const isInt = /^(?:0|(?:-?[1-9]\d*))$/;
      const isFloat = /^(-?[1-9]\d*\.\d+|-?0\.\d*[1-9])$/;
      if (newPrice && !isInt.test(newPrice) && !isFloat.test(newPrice)) {
        throw new Error('价格必须为数字');
      }

      const newCargoId = createCargo({
        name: newName,
        category: newCategory,
        unit: newUnit,
        description: newDescription,
        price: newPrice ? parseFloat(newPrice) : undefined,
        brand: newBrand,
      });

      if (!newCargoId) {
        throw new Error('货物创建失败');
      }
      ToastAndroid.show('货物添加成功', ToastAndroid.SHORT);
      navigation.navigate('CargoManage', {cargoName: newName});
    } catch (error: any) {
      Alert.alert('货物添加失败:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FormItem
        inline
        label="货物名称"
        placeholder="请输入新的货物名称"
        value={newName}
        onChangeText={setNewCargoName}
      />

      <FormItem inline label="货物类别">
        <RNPickerSelect
          placeholder={{label: '请选择货物类别', value: ''}}
          value={newCategory}
          onValueChange={setNewCargoCategory}
          useNativeAndroidPickerStyle={false}
          items={categories.map(category => ({
            label: category.name,
            value: category._id,
          }))}
          style={pickerSelectStyles}
        />
      </FormItem>

      <FormItem inline label="货物单位">
        <RNPickerSelect
          placeholder={{label: '请选择货物单位(可选)', value: ''}}
          value={newUnit}
          onValueChange={setNewCargoUnit}
          useNativeAndroidPickerStyle={false}
          items={units.map(unit => ({
            label: unit.name,
            value: unit._id,
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

      <FormItem inline label="货物品牌">
        <RNPickerSelect
          placeholder={{label: '请选择货物品牌(可选)', value: ''}}
          value={newBrand}
          onValueChange={setNewBrand}
          useNativeAndroidPickerStyle={false}
          items={brands.map(brand => ({
            label: brand.name,
            value: brand._id,
          }))}
          style={pickerSelectStyles}
        />
      </FormItem>

      <FormItem
        inline
        label="备注"
        placeholder="请输入备注(可选)"
        value={newDescription}
        onChangeText={setNewCargoDescription}
      />

      {/* 确认添加按钮 */}
      <Button
        title="确认添加"
        onPress={handleAdd}
        buttonStyle={{marginBottom: 10}}
        color="success"
      />

      {/* 取消按钮 */}
      <Button
        title="取消添加"
        onPress={() => navigation.goBack()}
        buttonStyle={{marginBottom: 40}}
        color="warning"
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
        <SpeedDial.Action
          icon={{
            name: 'institution',
            color: '#fff',
            type: 'font-awesome',
            size: 20,
          }}
          title="新增品牌"
          onPress={() => navigation.navigate('AddBrand')}
        />
      </SpeedDial>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});
