import {Button, Icon, ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {useCargo} from '../../../hooks/useCargo';
import {ModelManageProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';
import {Divider} from '@rneui/base';
import ModelItem from '../../../components/ModelItem';
import {useModel} from '../../../hooks/useModel';

export default function ModelManage({navigation}: ModelManageProps) {
  const {cargoList} = useCargo();
  const {deleteModel} = useModel();

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

  const handleEdit = (modelId: BSON.ObjectId) => {
    if (selectedCargo) {
      navigation.navigate('EditModel', {
        cargoId: selectedCargo.toHexString(),
        modelId: modelId.toHexString(),
      });
    } else {
      Alert.alert('请先选择一个货品!');
    }
  };

  const handleDelete = (modelId: BSON.ObjectId) => {
    if (selectedCargo) {
      Alert.alert('确定删除该规格?', '', [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          onPress: () => {
            deleteModel(selectedCargo, modelId);
          },
        },
      ]);
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
        ListHeaderComponent={() => (
          <>
            <Text style={styles.sectionTitle}>货品列表</Text>
            <Divider width={1} />
          </>
        )}
        renderItem={({item}) => (
          <ListItem
            bottomDivider
            onPress={() => handleSelect(item._id.toHexString())}
            containerStyle={styles.cargoItem}>
            <Icon
              name={
                selectedCargo?.toHexString() === item._id.toHexString()
                  ? 'label-important'
                  : 'label-important-outline'
              }
              type="material"
              color={
                selectedCargo?.toHexString() === item._id.toHexString()
                  ? colorStyle.primary
                  : colorStyle.textPrimary
              }
            />
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
        ListHeaderComponent={() => (
          <>
            <Text style={styles.sectionTitle}>规格列表</Text>
            <Divider width={1} />
          </>
        )}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <ModelItem
            item={item}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
        ListEmptyComponent={() =>
          selectedCargo ? (
            <Text style={[styles.modelDetails, {padding: 10}]}>
              该货品没有规格信息。
            </Text>
          ) : (
            <Text style={[styles.modelDetails, {padding: 10}]}>
              请先选择一个货品。
            </Text>
          )
        }
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
    backgroundColor: colorStyle.backgroundLight,
    borderRightColor: colorStyle.borderLight,
    borderRightWidth: 1,
  },
  rightContainer: {
    flex: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colorStyle.textSecondary,
    backgroundColor: colorStyle.backgroundLight,
    padding: 10,
  },
  cargoItem: {
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  modelDetailsContainer: {
    padding: 10,
  },
  modelDetails: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
    color: colorStyle.textSecondary,
  },
});
