import {useObject} from '@realm/react';
import {Icon, ListItem, Text} from '@rneui/themed';
import React from 'react';
import {FlatList} from 'react-native';
import {BSON, Results} from 'realm';
import {Cargo} from '../models/Cargo';
import {colorStyle} from '../styles';

interface ModelListProps {
  selectedCargo: BSON.ObjectId | null;
  selectedModel: BSON.ObjectId | null;
  onModelSelect: (modelId: BSON.ObjectId) => void;
  type: 'inbound' | 'outbound' | 'transfer';
}

const ModelList: React.FC<ModelListProps> = ({
  selectedCargo,
  selectedModel,
  onModelSelect,
  type,
}) => {
  const cargo = useObject(Cargo, selectedCargo || new BSON.ObjectId()); // 货品

  if (!selectedCargo) {
    return (
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          padding: 16,
          color: colorStyle.textSecondary,
        }}>
        请先选择货品。
      </Text>
    );
  } else {
    const models =
      type === 'inbound'
        ? cargo?.models
        : cargo?.models.filter(model => model.quantity > 0);
    return (
      <FlatList
        data={models}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <ListItem bottomDivider onPress={() => onModelSelect(item._id)}>
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
                当前库存: {item.quantity} {cargo?.unit || '件'}
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
    );
  }
};

export default ModelList;
