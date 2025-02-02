import {Button, Icon, ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useCargo} from '../../../hooks/useCargo';
import {Cargo} from '../../../models/Cargo';
import {ModelManageProps} from '../../../routes/types';

export default function ModelManage({navigation, route}: ModelManageProps) {
  const {cargoList} = useCargo();
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
      {/* 左侧货品列表 - 使用 FlatList 替换 ScrollView */}
      <FlatList
        style={styles.leftContainer}
        data={cargoList}
        keyExtractor={cargo => cargo._id.toHexString()}
        renderItem={({item}) => (
          <ListItem
            key={item._id.toHexString()}
            bottomDivider
            onPress={() => handleSelectCargo(item._id.toHexString())}
            containerStyle={styles.cargoItem}>
            <ListItem.Content>
              <ListItem.Title
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {item.name}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />

      {/* 右侧规格展示 */}
      <ScrollView style={styles.rightContainer}>
        {selectedCargo ? (
          <>
            <Text style={styles.sectionTitle}>右部分展示规格</Text>
            {selectedCargo.models.length > 0 ? (
              selectedCargo.models.map((model, index) => (
                <ListItem.Accordion
                  key={index}
                  containerStyle={styles.modelItem}
                  bottomDivider
                  content={
                    <View style={styles.modelDetailsContainer}>
                      <Text style={styles.modelDetails}>
                        <Text style={styles.boldText}>型号:</Text> {model.name}
                      </Text>
                      <Text style={styles.modelDetails}>
                        <Text style={styles.boldText}>数量:</Text>{' '}
                        {model.quantity}
                      </Text>
                      <Text style={styles.modelDetails}>
                        <Text style={styles.boldText}>描述:</Text>{' '}
                        {model.description}
                      </Text>
                    </View>
                  }
                />
              ))
            ) : (
              <Text>该货品没有规格信息。</Text>
            )}
          </>
        ) : (
          <Text>请选中一个货品查看规格。</Text>
        )}
      </ScrollView>

      <Button
        icon={<Icon name="add" size={30} color={'white'} />}
        containerStyle={{
          zIndex: 100,
          position: 'absolute',
          right: 20,
          bottom: 20,
          width: 60,
          height: 60,
        }}
        buttonStyle={{width: 60, height: 60, borderRadius: 30}}
        onPress={() => {
          navigation.navigate('AddModel', {
            cargoId: selectedCargo?._id.toHexString(),
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    flex: 1,
  },
  leftContainer: {
    flex: 1,
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
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  modelItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  modelDetailsContainer: {
    padding: 10,
  },
  modelDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
