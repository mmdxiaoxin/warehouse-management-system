import {Divider, SearchBar, SpeedDial} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BSON} from 'realm';
import CargoCard from '../../../components/CargoCard';
import {useCargo} from '../../../hooks/useCargo';
import {Cargo} from '../../../models/Cargo'; // 导入Cargo模型
import {CargoManageProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';
import {ToastAndroid} from 'react-native';

export default function CargoManage({navigation, route}: CargoManageProps) {
  const cargoName = route.params?.cargoName || '';
  const [searchQuery, setSearchQuery] = useState(cargoName);
  const [open, setOpen] = useState(false);

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
            ToastAndroid.show('货物删除成功', ToastAndroid.SHORT);
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
      case 'brand':
        {
          navigation.navigate('AddBrand');
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
        platform="android"
        containerStyle={{borderRadius: 15}}
      />
      <SectionList
        sections={groupByCategory(
          cargoList.filtered('name CONTAINS $0', searchQuery),
        )}
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
          </>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>没有货物数据</Text>
        }
        ListFooterComponent={<View style={{height: 80}}></View>} // 为了让 SpeedDial 不遮挡底部的内容
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
            name: 'institution',
            color: '#fff',
            type: 'font-awesome',
            size: 20,
          }}
          title="新增品牌"
          onPress={() => handleAdd('brand')}
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginTop: 10,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: colorStyle.textMuted,
    marginTop: 20,
  },
});
