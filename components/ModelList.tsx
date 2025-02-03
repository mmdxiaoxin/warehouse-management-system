import {Icon, Input, ListItem, Text} from '@rneui/themed';
import React from 'react';
import {FlatList} from 'react-native';
import {BSON, Results} from 'realm';
import {Cargo} from '../models/Cargo';
import {colorStyle} from '../styles';

interface ModelListProps {
  cargoList: Results<Cargo>;
  selectedCargo: BSON.ObjectId | null;
  selectedModel: BSON.ObjectId | null;
  handleSelectModel: (modelId: BSON.ObjectId) => void;
  unit: string;
  quantity: string;
  setQuantity: (quantity: string) => void;
}

const ModelList: React.FC<ModelListProps> = ({
  cargoList,
  selectedCargo,
  selectedModel,
  handleSelectModel,
  unit,
  quantity,
  setQuantity,
}) => {
  const models = selectedCargo
    ? cargoList.find(item => item._id.equals(selectedCargo))?.models
    : [];

  return (
    <>
      {selectedCargo ? (
        <FlatList
          data={models}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <ListItem bottomDivider onPress={() => handleSelectModel(item._id)}>
              <ListItem.Content>
                <Icon
                  name={
                    selectedModel?.toHexString() === item._id.toHexString()
                      ? 'label-important'
                      : 'label-important-outline'
                  }
                  type="material"
                  color={
                    selectedModel?.toHexString() === item._id.toHexString()
                      ? colorStyle.primary
                      : colorStyle.textPrimary
                  }
                />
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>
                  当前库存: {item.quantity} {unit}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                padding: 16,
                color: colorStyle.textSecondary,
              }}>
              该货品暂无规格。
            </Text>
          }
        />
      ) : (
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            padding: 16,
            color: colorStyle.textSecondary,
          }}>
          请先选择货品。
        </Text>
      )}

      {selectedModel && (
        <Input
          label="入库数量"
          value={String(quantity)}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="请输入数量"
          labelStyle={{marginTop: 16}}
        />
      )}
    </>
  );
};

export default ModelList;
