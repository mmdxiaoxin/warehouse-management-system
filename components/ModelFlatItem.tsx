// ModelFlatItem.tsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';

interface ModelFlatItemProps {
  item: {
    _id: BSON.ObjectId;
    models: string;
    quantity: number;
  };
}

const ModelFlatItem: React.FC<ModelFlatItemProps> = ({item}) => {
  return (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.models}</Text>
      <Text style={styles.itemQuantity}>数量: {item.quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
});

export default ModelFlatItem;
