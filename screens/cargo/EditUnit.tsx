import {useObject} from '@realm/react';
import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import {BSON} from 'realm';
import FormItem from '../../components/FormItem';
import {useUnit} from '../../hooks/useUnit';
import {Unit} from '../../models/Unit';
import {EditUnitProps} from '../../routes/types';

export default function EditUnit({navigation, route}: EditUnitProps) {
  const unitId = new BSON.ObjectId(route.params?.unitId);
  const unit = useObject(Unit, unitId);

  const [newName, setNewName] = useState(unit?.name || '');
  const [newDescription, setNewDescription] = useState(unit?.description || '');

  const {units, updateUnit} = useUnit();

  const handleSave = () => {
    // 校验输入字段是否为空
    if (!newName.trim()) {
      Alert.alert('请输入单位名称');
      return;
    }

    try {
      const found = units.find(c => c.name === newName);
      if (found && found._id.toString() !== unitId.toString()) {
        throw new Error('单位名称已存在');
      }

      updateUnit(unitId, {
        name: newName,
        description: newDescription,
      });

      ToastAndroid.show('成功修改单位', ToastAndroid.SHORT);
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
        label="单位名称"
        placeholder="请输入新的单位名称"
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
