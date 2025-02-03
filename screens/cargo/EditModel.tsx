import {useObject} from '@realm/react';
import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import {BSON} from 'realm';
import FormItem from '../../components/FormItem';
import ModelValueInput, {ModelValue} from '../../components/ModelValueInput';
import {useModel} from '../../hooks/useModel';
import {Cargo} from '../../models/Cargo';
import {Model} from '../../models/Model';
import {EditModelProps} from '../../routes/types';
import {parseWithOrder, stringifyWithOrder} from '../../utils';

export default function EditModel({navigation, route}: EditModelProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);
  const modelId = new BSON.ObjectId(route.params?.modelId);

  const cargo = useObject(Cargo, cargoId);
  const model = useObject(Model, modelId);

  const {updateModel} = useModel();

  const [modelName, setModelName] = useState<string>(model?.name || ''); // 规格名称
  const [modelValue, setModelValue] = useState<ModelValue>(
    parseWithOrder(model?.value || ''),
  ); // 规格值
  const [description, setDescription] = useState<string>(
    model?.description || '',
  ); // 规格备注

  const handleSave = () => {
    try {
      if (!modelName) {
        throw new Error('规格名称不能为空!');
      }

      if (!model) {
        throw new Error('规格不存在!');
      }

      if (!cargo) {
        throw new Error('货品不存在!');
      }

      // 规格名称不能重复
      const foundModel = cargo.models.find(
        m => m.name === modelName && !m._id.equals(modelId),
      );
      if (foundModel) {
        throw new Error('规格名称已存在!');
      }

      updateModel(cargoId, modelId, {
        name: modelName,
        value: stringifyWithOrder(modelValue),
        description,
        quantity: 0,
      });

      ToastAndroid.show('成功修改规格', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('修改规格失败:', error.message);
      return;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 选择货物 */}
      <FormItem inline label="选中货品" disabled value={cargo?.name} />

      {/* 规格名称输入 */}
      <FormItem
        inline
        label="规格名称"
        placeholder="请输入规格名称"
        value={modelName}
        onChangeText={setModelName}
      />

      {/* 规格描述输入 */}
      <FormItem
        label="备注"
        placeholder="请输入备注(选填)"
        value={description}
        onChangeText={setDescription}
        inline
      />

      {/* 规格值输入 */}
      <ModelValueInput modelValue={modelValue} onChange={setModelValue} />

      {/* 确认添加按钮 */}
      <Button
        title="保存修改"
        onPress={handleSave}
        color={'success'}
        disabled={!modelName}
        buttonStyle={{marginVertical: 10}}
      />

      {/* 取消按钮 */}
      <Button
        title="取消编辑"
        onPress={() => navigation.goBack()}
        color="warning"
        buttonStyle={{marginBottom: 40}}
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
