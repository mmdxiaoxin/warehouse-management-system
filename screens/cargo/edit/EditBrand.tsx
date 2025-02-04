import {useObject} from '@realm/react';
import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import {BSON} from 'realm';
import FormItem from '../../../components/FormItem';
import {useBrand} from '../../../hooks/useBrand';
import {Brand} from '../../../models/Brand';
import {EditBrandProps} from '../../../routes/types';

export default function EditBrand({navigation, route}: EditBrandProps) {
  const brandId = new BSON.ObjectId(route.params?.brandId);
  const brand = useObject(Brand, brandId);

  const [newName, setNewName] = useState(brand?.name || '');
  const [newDescription, setNewDescription] = useState(
    brand?.description || '',
  );

  const {brands, updateBrand} = useBrand();

  const handleSave = () => {
    // 校验输入字段是否为空
    if (!newName.trim()) {
      Alert.alert('请输入品牌名称');
      return;
    }

    try {
      const found = brands.find(c => c.name === newName);
      if (found && found._id.toString() !== brandId.toString()) {
        throw new Error('品牌名称已存在');
      }

      updateBrand(brandId, {
        name: newName,
        description: newDescription,
      });

      ToastAndroid.show('成功修改品牌', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(`修改失败: ${error.message}!`);
      return;
    }
  };
  return (
    <ScrollView style={styles.container}>
      <FormItem
        inline
        label="品牌名称"
        placeholder="请输入新的品牌名称"
        value={newName}
        onChangeText={setNewName}
      />

      <FormItem
        inline
        label="备注"
        placeholder="请输入备注(可选)"
        value={newDescription}
        onChangeText={setNewDescription}
      />

      {/* 确认添加按钮 */}
      <Button
        title="保存修改"
        onPress={handleSave}
        buttonStyle={{marginBottom: 10}}
        color="success"
      />

      <Button
        title="取消修改"
        onPress={() => navigation.goBack()}
        buttonStyle={{marginBottom: 10}}
        color="warning"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});
