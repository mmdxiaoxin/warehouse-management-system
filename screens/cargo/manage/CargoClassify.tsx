import {useRealm} from '@realm/react';
import {Divider} from '@rneui/base';
import {Button, Icon, ListItem, SearchBar} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {BSON} from 'realm';
import CargoList from '../../../components/CargoList';
import {useCategory} from '../../../hooks/useCategory';
import {CargoClassifyProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';

export default function CargoClassify({navigation, route}: CargoClassifyProps) {
  const realm = useRealm();
  const {categories} = useCategory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCargos, setSelectedCargos] = useState<BSON.ObjectId[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<BSON.ObjectId | null>();

  // 处理分类
  const handleClassify = () => {
    try {
      if (!selectedCategory) {
        throw new Error('请至少选择一个类别!');
      }

      if (selectedCargos.length === 0) {
        throw new Error('请至少选择一个货品!');
      }

      realm.write(() => {
        const category = realm
          .objects('Category')
          .filtered('_id == $0', selectedCategory)[0];

        selectedCargos.forEach(cargoId => {
          const cargo = realm
            .objects('Cargo')
            .filtered('_id == $0', cargoId)[0];
          cargo.category = category;
        });
      });

      ToastAndroid.show('分类成功', ToastAndroid.SHORT);
    } catch (error: any) {
      Alert.alert('分类失败', error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <SearchBar
        placeholder="搜索货品"
        value={searchQuery}
        onChangeText={setSearchQuery}
        platform="android"
        containerStyle={{borderRadius: 50}}
      />
      <View style={styles.modelContainer}>
        {/* 左侧货品列表 */}
        <View style={styles.leftContainer}>
          <CargoList
            multiple
            searchQuery={searchQuery}
            selectedCargos={selectedCargos}
            onCargosSelect={setSelectedCargos}
            ListHeaderComponent={() => (
              <>
                <Text style={styles.sectionTitle}>货品列表</Text>
                <Divider width={1} />
              </>
            )}
          />
        </View>

        {/* 右侧类别展示 */}
        <FlatList
          style={styles.rightContainer}
          data={categories}
          ListHeaderComponent={() => (
            <>
              <Text style={styles.sectionTitle}>类别列表</Text>
              <Divider width={1} />
            </>
          )}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <ListItem
              bottomDivider
              onPress={() => setSelectedCategory(item._id)}>
              <ListItem.Content>
                <Icon
                  name={
                    selectedCategory?.toHexString() === item._id.toHexString()
                      ? 'label-important'
                      : 'label-important-outline'
                  }
                  type="material"
                  color={
                    selectedCategory?.toHexString() === item._id.toHexString()
                      ? colorStyle.primary
                      : colorStyle.textPrimary
                  }
                />
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}
        />

        {/* 确认分类按钮 */}
        <Button
          icon={<Icon name="edit" size={24} color={'white'} />}
          containerStyle={{
            zIndex: 100,
            position: 'absolute',
            right: 20,
            bottom: 20,
            width: 100,
            height: 50,
          }}
          buttonStyle={{width: 100, height: 50, borderRadius: 20}}
          onPress={handleClassify}>
          <Text style={{color: 'white', fontSize: 14}}>确认分类</Text>
        </Button>
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
