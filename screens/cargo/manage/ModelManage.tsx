import {Divider} from '@rneui/base';
import {Button, Icon, SearchBar} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import CargoList from '../../../components/CargoList';
import ModelItem from '../../../components/ModelItem';
import {useCargo} from '../../../hooks/useCargo';
import {useModel} from '../../../hooks/useModel';
import {ModelManageProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';

export default function ModelManage({navigation, route}: ModelManageProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);

  const {cargoList} = useCargo();
  const {deleteModel} = useModel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>(
    cargoId,
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
    <View style={{flex: 1}}>
      <SearchBar
        placeholder="搜索货品"
        value={searchQuery}
        onChangeText={setSearchQuery}
        lightTheme
        round
      />
      <View style={styles.modelContainer}>
        {/* 左侧货品列表 */}
        <View style={styles.leftContainer}>
          <CargoList
            selectedCargo={selectedCargo}
            onCargoSelect={cargoId => handleSelect(cargoId.toHexString())}
            ListHeaderComponent={() => (
              <>
                <Text style={styles.sectionTitle}>货品列表</Text>
                <Divider width={1} />
              </>
            )}
          />
        </View>

        {/* 右侧规格展示 */}
        <FlatList
          style={styles.rightContainer}
          data={
            selectedCargo
              ? cargoList.find(
                  item =>
                    item._id.toHexString() === selectedCargo.toHexString(),
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
    </View>
  );
}

const styles = StyleSheet.create({
  modelContainer: {
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
