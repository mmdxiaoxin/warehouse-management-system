import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  SectionList,
  Alert,
  StyleSheet,
  TextInput,
} from 'react-native';
import {cargoRepository} from '../models/CargoRepository';
import RNFS from 'react-native-fs';
import CargoItem from '../components/CargoItem';
import {
  useFocusEffect,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {RootStackParamList} from '../routes';
import Divider from '../components/Divider';

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
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储货物列表
  const [filteredCargoList, setFilteredCargoList] = useState<any[]>([]); // 存储筛选后的货物列表
  const [searchQuery, setSearchQuery] = useState(''); // 搜索框的查询
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadCargoData = async () => {
    try {
      const cargos = await cargoRepository.getAllCargo(); // 获取所有货物
      setCargoList(cargos);
      setFilteredCargoList(cargos); // 初始化筛选后的货物列表
    } catch (error) {
      console.error('获取货物数据时出错：', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const deleteRealmDatabase = async () => {
        const realmPath = `${RNFS.DocumentDirectoryPath}/cargo.realm`; // 默认路径
        try {
          // 删除数据库文件
          await RNFS.unlink(realmPath);
          console.log('Realm 数据库文件已删除！');
        } catch (error) {
          console.error('删除 Realm 数据库时出错：', error);
        }
      };

      // deleteRealmDatabase(); // 用来删除数据库文件进行测试，防止数据库修改后导致的应用闪退
      loadCargoData();
    }, []),
  );

  // 按照类别进行分组
  const groupByCategory = (cargoList: any[]) => {
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

  // 处理货物删除操作
  const handleDeleteCargo = (cargoId: string) => {
    Alert.alert('确认删除', '您确定要删除这个货物吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '确定',
        onPress: async () => {
          try {
            await cargoRepository.deleteCargo(cargoId);
            setCargoList(prevCargoList =>
              prevCargoList.filter(cargo => cargo.cargoId !== cargoId),
            ); // 更新列表
            console.log('货物已删除！');
          } catch (error) {
            console.error('删除货物时出错：', error);
          }
        },
      },
    ]);
  };

  // 处理货物信息更新
  const handleEditCargo = async (cargoId: string) => {
    try {
      navigation.navigate('EditCargo', {cargoId});
    } catch (error) {
      console.error('更新货物状态时出错：', error);
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

      await cargoRepository.createCargo(newCargo); // 创建货物
      loadCargoData();
    } catch (error) {
      console.error('创建货物时出错：', error);
    }
  };

  // 根据查询过滤货物列表
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = cargoList.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredCargoList(filtered);
    } else {
      setFilteredCargoList(cargoList); // 如果没有输入内容，显示所有货物
    }
  };

  const groupedCargo = groupByCategory(filteredCargoList);

  return (
    <View style={{flex: 1, padding: 20}}>
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
        keyExtractor={(item, index) => String(item.cargoId) + index} // 使用 cargoId 和 index 作为 key
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
      />
    </View>
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
});
