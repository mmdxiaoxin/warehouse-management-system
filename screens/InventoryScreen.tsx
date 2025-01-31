import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import {BSON} from 'realm';
import CargoSectionItem from '../components/CargoSectionItem';
import Divider from '../components/Divider';
import {useCargo} from '../hooks/useCargo';
import {Cargo} from '../models/Cargo'; // 导入Cargo模型
import {RootStackParamList} from '../routes';
import {colorStyle} from '../styles';

export default function InventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedCargo, setGroupedCargo] = useState<
    {title: string; data: any[]}[]
  >([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 使用 Realm 查询所有的货物数据
  const {cargoList, deleteCargo} = useCargo();

  const groupByCategory = (cargoList: Realm.Results<Cargo>) => {
    const grouped: {title: string; data: any[]}[] = [];
    const categories = Array.from(
      new Set(cargoList.map(cargo => cargo.category)),
    );

    categories.forEach(category => {
      const filteredCargo = cargoList.filter(
        cargo => cargo.category === category,
      );
      grouped.push({
        title: category,
        data: filteredCargo,
      });
    });

    return grouped;
  };

  useEffect(() => {
    if (cargoList && cargoList.length > 0) {
      const grouped = groupByCategory(
        cargoList.filtered('name CONTAINS $0', searchQuery),
      );
      setGroupedCargo(grouped);
    }
  }, [cargoList, searchQuery]);

  const handleDeleteCargo = (cargoId: BSON.ObjectId) => {
    Alert.alert('确认删除', '您确定要删除这个货物吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '确定',
        onPress: async () => {
          try {
            deleteCargo(cargoId);
            const updatedCargoList = cargoList.filtered(
              'name CONTAINS $0',
              searchQuery,
            );
            const grouped = groupByCategory(updatedCargoList);
            setGroupedCargo(grouped);
          } catch (error) {
            console.error('删除货物时出错：', error);
            Alert.alert('删除失败', '删除货物时发生错误，请稍后再试。');
          }
        },
      },
    ]);
  };

  const handleEditCargo = (cargoId: BSON.ObjectId) => {
    try {
      navigation.navigate('EditCargo', {cargoId: cargoId.toHexString()});
    } catch (error) {
      console.error('导航到编辑页面时出错：', error);
      Alert.alert('导航错误', '无法导航到编辑页面，请稍后再试。');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="搜索货物名称"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <SectionList
        sections={groupedCargo}
        keyExtractor={item => String(item._id)}
        renderItem={({item}) => (
          <CargoSectionItem
            item={item}
            handleEditCargo={handleEditCargo}
            handleDeleteCargo={handleDeleteCargo}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <>
            <Text style={styles.sectionHeader}>{title}</Text>
            <Divider />
          </>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>没有货物数据</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: colorStyle.info,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 8,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
