import {Button, Icon, ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {useCargo} from '../../../hooks/useCargo';
import {ModelManageProps} from '../../../routes/types';

export default function ModelManage({navigation}: ModelManageProps) {
  const {cargoList} = useCargo();
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>(
    null,
  );

  // 处理选中货品
  const handleSelect = (cargoId: string) => {
    const cargo = cargoList.find(item => item._id.toHexString() === cargoId);
    if (cargo) {
      setSelectedCargo(cargo._id);
    }
  };

  const handleAdd = () => {
    if (selectedCargo) {
      navigation.navigate('AddModel', {cargoId: selectedCargo.toHexString()});
    } else {
      Alert.alert('请先选择一个货品!');
    }
  };

  return (
    <View style={styles.container}>
      {/* 左侧货品列表 */}
      <FlatList
        style={styles.leftContainer}
        data={cargoList}
        keyExtractor={cargo => cargo._id.toHexString()}
        renderItem={({item}) => (
          <ListItem
            bottomDivider
            onPress={() => handleSelect(item._id.toHexString())}
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
      <FlatList
        style={styles.rightContainer}
        data={
          selectedCargo
            ? cargoList.find(
                item => item._id.toHexString() === selectedCargo.toHexString(),
              )?.models
            : []
        }
        keyExtractor={item => item._id.toString()}
        renderItem={({item, index}) => (
          <ListItem key={index} containerStyle={styles.modelItem} bottomDivider>
            <ListItem.Content style={styles.modelDetails}>
              <ListItem.Title style={styles.boldText}>
                {`型号: ${item.name}`}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.modelDetails}>该货品没有规格信息。</Text>
        )}
      />

      {/* 添加新规格按钮 */}
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
        onPress={handleAdd}
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
