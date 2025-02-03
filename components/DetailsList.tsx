import {Button, Icon, ListItem, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {BSON} from 'realm';
import {colorStyle} from '../styles';

export type Details = Record<
  string,
  {
    cargoName: string;
    unit: string;
    models: Array<{
      modelId: BSON.ObjectId;
      modelName: string;
      quantity: string;
    }>;
  }
>;

interface DetailsListProps {
  details: Details;
  onDeleted?: (modelId: BSON.ObjectId) => void;
  onUpdated?: (modelId: BSON.ObjectId, quantity: string) => void;
}

const DetailsList: React.FC<DetailsListProps> = ({
  details,
  onDeleted,
  onUpdated,
}) => {
  const [expandedCargoIds, setExpandedCargoIds] = useState<string[]>([]); // 展开的货品 ID

  // 切换展开/折叠
  const toggleAccordion = (cargoId: string) => {
    setExpandedCargoIds(prevState =>
      prevState.includes(cargoId)
        ? prevState.filter(id => id !== cargoId)
        : [...prevState, cargoId],
    );
  };

  // 渲染每个型号的按钮
  const renderModelButtons = (model: {
    modelId: BSON.ObjectId;
    quantity: string;
  }) => (
    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
      <View style={styles.opContainer}>
        <Button
          type="clear"
          icon={<Icon name="remove" type="material" size={20} />}
          containerStyle={[styles.opButton]}
          onPress={() => {
            const newQuantity = String(Number(model.quantity) - 1);
            if (Number(newQuantity) < 0) {
              return;
            }
            onUpdated?.(model.modelId, newQuantity);
          }}
        />
        <Button
          type="clear"
          icon={<Icon name="add" type="material" size={20} />}
          containerStyle={[styles.opButton, {borderLeftWidth: 0}]}
          onPress={() => {
            const newQuantity = String(Number(model.quantity) + 1);
            onUpdated?.(model.modelId, newQuantity);
          }}
        />
      </View>
      <Button
        icon={<Icon name="delete" type="material" color={colorStyle.white} />}
        buttonStyle={[styles.actionButton, styles.deleteButton]}
        onPress={() => onDeleted?.(model.modelId)}
      />
    </View>
  );

  return (
    <FlatList
      data={Object.values(details)}
      keyExtractor={item => item.cargoName}
      renderItem={({item}) => (
        <ListItem.Accordion
          key={item.cargoName}
          containerStyle={{backgroundColor: colorStyle.neutral200}}
          bottomDivider
          content={
            <ListItem.Content>
              <ListItem.Title
                style={{fontSize: 18, fontWeight: 'bold', paddingLeft: 16}}>
                {item.cargoName}
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={!expandedCargoIds.includes(item.cargoName)}
          onPress={() => toggleAccordion(item.cargoName)}>
          {item.models.map(model => (
            <ListItem key={model.modelId.toString()} bottomDivider>
              <Icon
                name="package-variant-closed"
                type="material-community"
                color={colorStyle.primary}
              />
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: colorStyle.textPrimary,
                    marginBottom: 4,
                    fontWeight: 'bold',
                  }}>
                  型号: {model.modelName}
                </ListItem.Title>
                <ListItem.Subtitle style={{color: colorStyle.textSecondary}}>
                  数量:{' '}
                  <Text
                    style={{
                      color: colorStyle.primaryLight,
                      fontWeight: 'bold',
                    }}>
                    {model.quantity}
                  </Text>{' '}
                  {item.unit}
                </ListItem.Subtitle>
              </ListItem.Content>
              {/* 渲染按钮操作 */}
              {renderModelButtons(model)}
            </ListItem>
          ))}
        </ListItem.Accordion>
      )}
      ListEmptyComponent={
        <ListItem containerStyle={{backgroundColor: colorStyle.neutral200}}>
          <ListItem.Content>
            <ListItem.Title style={{color: colorStyle.textMuted}}>
              当前暂无记录
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      }
    />
  );
};

// 按钮样式
const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: colorStyle.primary,
    borderRadius: 5,
    marginHorizontal: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 30,
  },
  opContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opButton: {
    backgroundColor: colorStyle.backgroundLight,
    borderWidth: 1,
    borderColor: colorStyle.borderMedium,
  },
  deleteButton: {
    backgroundColor: colorStyle.danger,
    marginLeft: 8,
    minWidth: 40,
  },
});

export default DetailsList;
