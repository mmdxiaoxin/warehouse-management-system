import {ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {SelectCargoProps} from '../../routes/types';

export default function SelectCargo({navigation, route}: SelectCargoProps) {
  const {cargoId} = route.params;
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // 模拟货品数据
  const cargoList = [
    {id: '1', name: '货品 A'},
    {id: '2', name: '货品 B'},
    {id: '3', name: '货品 C'},
  ];

  const handleSelectProduct = (productId: string) => {
    const selected = cargoList.find(cargo => cargo.id === productId);
    setSelectedProduct(selected);
    navigation.navigate('SelectModel', {productId});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>选择货品</Text>
      <FlatList
        data={cargoList}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListItem bottomDivider onPress={() => handleSelectProduct(item.id)}>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
