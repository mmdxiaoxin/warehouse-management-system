import {Divider, SearchBar} from '@rneui/themed';
import React, {useState} from 'react';
import {SafeAreaView, SectionList, StyleSheet, Text} from 'react-native';
import CargoItem from '../../components/CargoItem';
import {useCargo} from '../../hooks/useCargo';
import {Cargo} from '../../models/Cargo'; // 导入Cargo模型
import {CargoInventoryProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function CargoInventory({navigation}: CargoInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const {cargoList} = useCargo();

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

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="搜索货物名称"
        value={searchQuery}
        onChangeText={setSearchQuery}
        platform="android"
        containerStyle={{borderRadius: 50}}
      />

      <SectionList
        sections={groupByCategory(
          cargoList.filtered('name CONTAINS $0', searchQuery),
        )}
        keyExtractor={item => String(item._id)}
        renderItem={({item}) => <CargoItem item={item} />}
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
    fontSize: 14,
    textAlign: 'center',
    color: colorStyle.textMuted,
    marginTop: 20,
  },
});
