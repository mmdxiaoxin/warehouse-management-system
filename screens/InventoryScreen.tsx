import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
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

// 随机生成字符串的函数
const generateRandomString = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// 随机选择一个类别
const getRandomCategory = () => {
  const categories = ['木门', '木地板', '辅料'];
  return categories[Math.floor(Math.random() * categories.length)];
};

export default function InventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedCargo, setGroupedCargo] = useState<
    {title: string; data: any[]}[]
  >([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 使用 Realm 查询所有的货物数据
  const {cargoList, createCargo, deleteCargo} = useCargo();

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
    // 按照类别进行分组

    if (cargoList && cargoList.length > 0) {
      const grouped = groupByCategory(
        cargoList.filtered('name CONTAINS $0', searchQuery),
      );
      setGroupedCargo(grouped);
    }
  }, [cargoList, searchQuery]);

  // 处理货物删除操作
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
            deleteCargo(cargoId); // 删除数据

            // 删除后更新列表，过滤掉已删除的对象（防止删除后重复使用导致的Realm异常闪退）
            const updatedCargoList = cargoList.filtered(
              'name CONTAINS $0',
              searchQuery,
            );
            const grouped = groupByCategory(updatedCargoList); // 重新分组
            setGroupedCargo(grouped); // 更新状态
          } catch (error) {
            console.error('删除货物时出错：', error);
            Alert.alert('删除失败', '删除货物时发生错误，请稍后再试。');
          }
        },
      },
    ]);
  };

  // 处理货物信息更新
  const handleEditCargo = (cargoId: BSON.ObjectId) => {
    try {
      navigation.navigate('EditCargo', {cargoId: cargoId.toHexString()}); // 导航到编辑页面
    } catch (error) {
      console.error('导航到编辑页面时出错：', error);
      Alert.alert('导航错误', '无法导航到编辑页面，请稍后再试。');
    }
  };

  // 处理创建货物
  const handleCreateCargo = async () => {
    try {
      const category = getRandomCategory(); // 随机选择一个类别
      const newCargo = {
        name: category + generateRandomString(8), // 随机生成名称
        description: '随机生成的货物项目',
        category,
        unit: '个',
      };
      createCargo(newCargo);
    } catch (error) {
      console.error('创建货物时出错：', error);
      Alert.alert('创建失败', '创建货物时发生错误，请稍后再试。');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 20}}>
      <Button title="添加一项随机货物" onPress={handleCreateCargo} />

      {/* 筛选框 */}
      <TextInput
        style={styles.searchInput}
        placeholder="搜索货物名称"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 使用 SectionList 展示分组的货物 */}
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
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
