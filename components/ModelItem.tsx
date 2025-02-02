import {Button, Icon, ListItem} from '@rneui/themed';
import React, {useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {Model} from '../models/Model';
import {colorStyle, fontStyle} from '../styles';

interface CargoItemProps {
  item: Pick<
    Model,
    '_id' | 'name' | 'value' | 'description' | 'ctime' | 'utime'
  >;
  handleEdit: (modelId: BSON.ObjectId) => void;
  handleDelete: (modelId: BSON.ObjectId) => void;
}

const ModelItem: React.FC<CargoItemProps> = ({
  item,
  handleEdit,
  handleDelete,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <ListItem.Accordion
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
      containerStyle={styles.modelItem}
      bottomDivider
      content={
        <ListItem.Content style={styles.modelDetails}>
          <ListItem.Title style={styles.boldText}>
            {`型号: ${item.name}`}
          </ListItem.Title>
        </ListItem.Content>
      }>
      <ListItem>
        <ListItem.Content style={styles.modelDetailsContainer}>
          <Button
            title="编辑"
            color={'success'}
            onPress={() => handleEdit(item._id)}
            containerStyle={{width: '48%'}}
          />
          <Button
            title="删除"
            onPress={() => handleDelete(item._id)}
            color={'error'}
            containerStyle={{width: '48%'}}
          />
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  );
};

const styles = StyleSheet.create({
  modelItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modelDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modelDetails: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
    color: colorStyle.textSecondary,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default ModelItem;
