import {useObject} from '@realm/react';
import {Button, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {BSON} from 'realm';
import FormItem from '../../components/FormItem';
import ModelValueInput, {ModelValue} from '../../components/ModelValueInput';
import {useModel} from '../../hooks/useModel';
import {Cargo} from '../../models/Cargo';
import {AddModelProps} from '../../routes/types';
import {colorStyle} from '../../styles';
import {stringifyWithOrder} from '../../utils';

export default function AddModel({navigation, route}: AddModelProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);

  const cargo = useObject(Cargo, cargoId);
  const {createModel} = useModel();

  const [modelName, setModelName] = useState<string>(''); // 规格名称
  const [modelValue, setModelValue] = useState<ModelValue>([]); // 规格值
  const [description, setDescription] = useState<string>(''); // 规格备注

  const handleAdd = () => {
    try {
      if (!modelName) {
        throw new Error('规格名称不能为空!');
      }
      const newModel = createModel(cargoId, {
        name: modelName,
        value: stringifyWithOrder(modelValue),
        description,
        quantity: 0,
      });
      if (!newModel) {
        throw new Error('创建规格失败!');
      }
      ToastAndroid.show('添加规格成功', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('添加规格失败:', error.message);
      return;
    }
  };

  if (!cargo) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colorStyle.backgroundLight,
        }}>
        <Text h4 h4Style={{color: colorStyle.textMuted}}>
          请先选择货品，然后点击按钮填加！
        </Text>
      </SafeAreaView>
    );
  }

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
        title="确认添加"
        onPress={handleAdd}
        color={'primary'}
        disabled={!modelName}
        buttonStyle={{marginVertical: 10}}
      />

      {/* 取消按钮 */}
      <Button
        title="取消添加"
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
