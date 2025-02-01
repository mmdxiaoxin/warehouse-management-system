import {useObject} from '@realm/react';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text} from 'react-native';
import {BSON} from 'realm';
import AdvancedButton from '../components/AdvancedButton';
import CargoSpecInput, {CargoSpec} from '../components/CargoSpecInput';
import {useCargoItem} from '../hooks/useCargoItem';
import {Cargo} from '../models/Cargo';
import {EditModelProps} from '../routes/types';
import {fontStyle} from '../styles';
import {parseWithOrder, stringifyWithOrder} from '../utils';

export default function EditModelScreen({navigation, route}: EditModelProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);
  const cargoItemId = new BSON.ObjectId(route.params?.cargoItemId);

  const cargo = useObject(Cargo, cargoId);
  const cargoItem = cargo?.items.find(item => item._id.equals(cargoItemId));
  const {updateCargoItem} = useCargoItem();

  const [spec, setSpec] = useState<CargoSpec>(
    parseWithOrder(cargoItem?.models || '') || [],
  );

  // 保存型号规格
  const handleSaveModels = () => {
    if (!cargo || !cargoItem) {
      Alert.alert('错误', '未找到货物或型号');
      return;
    }

    const newModels = stringifyWithOrder(spec);
    if (cargo.items.find(item => item.models === newModels)) {
      Alert.alert('型号重复', '当前已有相同的型号!');
      return;
    }

    updateCargoItem(cargo._id, cargoItem._id, {
      models: newModels,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>编辑型号规格</Text>

      {/* 货物规格输入 */}
      <CargoSpecInput specifications={spec} onChange={setSpec} />

      {/* 保存修改按钮 */}
      <AdvancedButton
        title="保存修改"
        onPress={handleSaveModels}
        disabled={spec.length === 0}
        buttonStyle={{marginVertical: 10}}
      />

      {/* 取消按钮 */}
      <AdvancedButton
        title="取消添加"
        onPress={() => navigation.goBack()}
        type="warning"
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
  title: {
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
  },
});
