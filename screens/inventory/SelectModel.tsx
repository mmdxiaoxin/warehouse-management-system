import {ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {SelectModelProps} from '../../routes/types';

export default function SelectModel({navigation, route}: SelectModelProps) {
  const {cargoId} = route.params;
  const [selectedModel, setSelectedModel] = useState<any | null>(null);

  // 模拟规格数据
  const models = [
    {id: '1', name: '规格 A', quantity: 100, description: '描述 A'},
    {id: '2', name: '规格 B', quantity: 200, description: '描述 B'},
  ];

  const handleSelectModel = (modelId: string) => {
    const selected = models.find(model => model.id === modelId);
    setSelectedModel(selected);
    // 选择规格后返回入库管理界面
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>选择规格</Text>
      <FlatList
        data={models}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListItem bottomDivider onPress={() => handleSelectModel(item.id)}>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.quantity} 件</ListItem.Subtitle>
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
