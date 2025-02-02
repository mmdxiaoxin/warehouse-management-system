import {useObject} from '@realm/react';
import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import FormItem from '../../components/FormItem';
import {useCargo} from '../../hooks/useCargo';
import {Cargo} from '../../models/Cargo';
import {EditCargoProps} from '../../routes/types';
import {fontStyle, pickerSelectStyles} from '../../styles';

export default function EditCargo({navigation, route}: EditCargoProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);

  const {updateCargo} = useCargo();
  const foundCargo = useObject(Cargo, cargoId);

  const [newCargoName, setNewCargoName] = useState(foundCargo?.name || '');
  const [newCargoCategory, setNewCargoCategory] = useState(
    foundCargo?.category || '',
  );
  const [newCargoUnit, setNewCargoUnit] = useState(foundCargo?.unit || '个');
  const [newCargoDescription, setNewCargoDescription] = useState(
    foundCargo?.description || '',
  );

  // 校验输入数据
  const handleSaveCargo = async () => {
    if (!newCargoName.trim()) {
      Alert.alert('请输入货物名称');
      return;
    }
    if (!newCargoCategory.trim()) {
      Alert.alert('请选择货物类别');
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
      });

      Alert.alert('货物更新成功');
      navigation.goBack(); // 返回上一页
    } catch (error) {
      console.error('更新货物失败:', error);
      Alert.alert('更新货物失败，请重试！');
    }
  };

  if (!foundCargo) {
    return <Text>加载货物信息...</Text>; // 如果 cargo 数据未加载完成，显示加载信息
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>编辑货物</Text>

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
          items={[
            {label: '门', value: '门'},
            {label: '地板', value: '地板'},
            {label: '辅料', value: '辅料'},
          ]}
          style={pickerSelectStyles}
        />
      </FormItem>

      {/* 货物单位 */}
      <FormItem
        inline
        label="货物单位"
        value={newCargoUnit}
        onChangeText={setNewCargoUnit}
        placeholder="请输入货物单位"
      />

      {/* 货物描述 */}
      <FormItem
        inline
        label="货物描述"
        value={newCargoDescription}
        onChangeText={setNewCargoDescription}
        placeholder="请输入货物描述"
      />

      {/* 保存按钮 */}
      <Button
        title="保存"
        onPress={handleSaveCargo}
        color="primary"
        buttonStyle={{marginBottom: 10}}
      />

      {/* 取消按钮 */}
      <Button
        title="取消"
        onPress={() => navigation.goBack()}
        color="warning"
        buttonStyle={{marginBottom: 10}}
      />

      {/* 仓管快捷跳转 */}
      <Button
        title="仓管"
        onPress={() =>
          navigation.navigate('HomeTabs', {
            screen: 'Cargo',
          })
        }
        color="success"
        buttonStyle={{marginBottom: 40}}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
  },
});
