import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCargo} from '../../../hooks/useCargo';
import {Cargo} from '../../../models/Cargo';
import {ModelManageProps} from '../../../routes/types';

export default function ModelManage({navigation, route}: ModelManageProps) {
  const {cargoList} = useCargo();
  // 用来存储选中的货品
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);

  // 处理选中货品
  const handleSelectCargo = (cargoId: string) => {
    const cargo = cargoList.find(item => item._id.toHexString() === cargoId);
    if (cargo) {
      setSelectedCargo(cargo);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.leftContainer}>
        <Text style={styles.sectionTitle}>左部分选择货品</Text>
        {cargoList.map(cargo => (
          <TouchableOpacity
            key={cargo._id.toHexString()}
            onPress={() => handleSelectCargo(cargo._id.toHexString())}
            style={styles.cargoItem}>
            <Text style={styles.cargoName}>{cargo.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.rightContainer}>
        {selectedCargo ? (
          <>
            <Text style={styles.sectionTitle}>右部分展示规格</Text>
            {selectedCargo.models.length > 0 ? (
              selectedCargo.models.map((model, index) => (
                <View key={index} style={styles.modelItem}>
                  <Text style={styles.modelTitle}>规格 {index + 1}</Text>
                  <Text style={styles.modelDetails}>
                    <Text style={styles.boldText}>型号:</Text> {model.name}
                  </Text>
                  <Text style={styles.modelDetails}>
                    <Text style={styles.boldText}>数量:</Text> {model.quantity}
                  </Text>
                  <Text style={styles.modelDetails}>
                    <Text style={styles.boldText}>描述:</Text>{' '}
                    {model.description}
                  </Text>
                </View>
              ))
            ) : (
              <Text>该货品没有规格信息。</Text>
            )}
          </>
        ) : (
          <Text>请选中一个货品查看规格。</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    flex: 1,
  },
  leftContainer: {
    flex: 1,
    marginRight: 20,
  },
  rightContainer: {
    flex: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cargoItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  cargoName: {
    fontSize: 16,
  },
  modelItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  modelTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modelDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
