import {Divider, SearchBar, SpeedDial} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, SectionList, StyleSheet, Text} from 'react-native';
import {BSON} from 'realm';
import CargoCard from '../../../components/CargoCard';
import {useCargo} from '../../../hooks/useCargo';
import {Cargo} from '../../../models/Cargo'; // 导入Cargo模型
import {CargoManageProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';

export default function CargoManage({navigation}: CargoManageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [groupedCargo, setGroupedCargo] = useState<
    {title: string; data: any[]}[]
  >([]);

  // 使用 Realm 查询所有的货物数据
  const {cargoList, deleteCargo} = useCargo();

  const groupByCategory = (cargoList: Realm.Results<Cargo>) => {
    const grouped: {title: string; data: any[]}[] = [];

    // 处理空类别，默认显示为 "未分类"
    const categories = Array.from(
      new Set(cargoList.map(cargo => cargo.category?.name || '未分类')), // 如果为空，归类为 "未分类"
    );

    categories.forEach(category => {
      const filteredCargo = cargoList.filter(
        cargo =>
          cargo.category?.name === category ||
          (category === '未分类' && !cargo.category),
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

  const handleDelete = (cargoId: BSON.ObjectId) => {
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

  const handleEdit = (cargoId: BSON.ObjectId) => {
    try {
      navigation.navigate('EditCargo', {cargoId: cargoId.toHexString()});
    } catch (error) {
      console.error('导航到编辑页面时出错：', error);
      Alert.alert('导航错误', '无法导航到编辑页面，请稍后再试。');
    }
  };

  // 处理 SpeedDial 按钮点击事件，跳转到 AddCargo 页面
  const handleAdd = (type: string) => {
    switch (type) {
      case 'cargo':
        {
          navigation.navigate('AddCargo');
          setOpen(false);
        }
        break;
      case 'category':
        {
          navigation.navigate('AddCategory');
          setOpen(false);
        }
        break;
      case 'unit':
        {
          navigation.navigate('AddUnit');
          setOpen(false);
        }
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="搜索货物名称"
        value={searchQuery}
        onChangeText={setSearchQuery}
        lightTheme
        round
      />
      <SectionList
        sections={groupedCargo}
        keyExtractor={item => String(item._id)}
        renderItem={({item}) => (
          <CargoCard
            item={item}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <>
            <Text style={styles.sectionHeader}>{title}</Text>
            <Divider width={1} style={{marginVertical: 10}} />
          </>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>没有货物数据</Text>
        }
      />
      <SpeedDial
        isOpen={open}
        icon={{name: 'plus', color: '#fff', type: 'antdesign'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          icon={{name: 'add', color: '#fff'}}
          title="新增货品"
          onPress={() => handleAdd('cargo')}
        />
        <SpeedDial.Action
          icon={{
            name: 'folder-open',
            color: '#fff',
            type: 'font-awesome',
            size: 20,
            style: {marginLeft: 2, marginTop: 2},
          }}
          title="新增类别"
          onPress={() => handleAdd('category')}
        />
        <SpeedDial.Action
          icon={{
            name: 'balance-scale',
            color: '#fff',
            type: 'font-awesome',
            size: 20,
          }}
          title="新增单位"
          onPress={() => handleAdd('unit')}
        />
        <SpeedDial.Action
          icon={{
            name: 'cogs',
            color: '#fff',
            type: 'font-awesome',
            size: 20,
          }}
          title="规格管理"
          onPress={() => {
            navigation.navigate('ModelManage');
            setOpen(false);
          }}
        />
      </SpeedDial>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
