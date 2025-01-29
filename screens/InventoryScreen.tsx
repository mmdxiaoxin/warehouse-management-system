import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  SectionList,
  Alert,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {useRealm, useQuery} from '@realm/react'; // 导入 Realm 的 hooks
import {Cargo} from '../models/Cargo'; // 导入Cargo模型
import CargoItem from '../components/CargoItem';
import {
  useFocusEffect,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {RootStackParamList} from '../routes';
import Divider from '../components/Divider';
import {BSON} from 'realm';

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
  const realm = useRealm();

  // 使用 Realm 查询所有的货物数据
  const cargoList = useQuery(Cargo);

  // 根据查询过滤货物列表
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // 按照类别进行分组
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
      const grouped = groupByCategory(cargoList.filtered('TRUEPREDICATE()'));
      setGroupedCargo(grouped);
    }
  }, [cargoList]);

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
            realm.write(() => {
              const cargoToDelete = realm.objectForPrimaryKey(Cargo, cargoId);
              if (cargoToDelete) {
                realm.delete(cargoToDelete);
                console.log('货物已删除！');
              }
            });
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
      navigation.navigate('EditCargo', {cargoId: cargoId.toHexString()});
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
        _id: new BSON.ObjectId(),
        name: category + generateRandomString(8), // 随机生成名称
        description: '随机生成的货物项目',
        category,
        unit: '个',
        ctime: new Date(),
        utime: new Date(),
      };

      realm.write(() => {
        realm.create(Cargo, newCargo);
      });
    } catch (error) {
      console.error('创建货物时出错：', error);
      Alert.alert('创建失败', '创建货物时发生错误，请稍后再试。');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>库存管理</Text>
      <Button title="添加一项随机货物" onPress={handleCreateCargo} />

      {/* 筛选框 */}
      <TextInput
        style={styles.searchInput}
        placeholder="搜索货物名称"
        value={searchQuery}
        onChangeText={handleSearchChange}
      />

      {/* 使用 SectionList 展示分组的货物 */}
      <SectionList
        sections={groupedCargo}
        keyExtractor={(item, index) => String(item._id) + index} // 使用 _id 和 index 作为 key
        renderItem={({item}) => (
          <CargoItem
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
