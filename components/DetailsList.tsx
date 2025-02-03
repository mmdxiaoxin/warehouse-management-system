import {Icon, ListItem} from '@rneui/themed';
import React from 'react';
import {FlatList} from 'react-native';
import {BSON} from 'realm';
import {colorStyle} from '../styles';

export type Details = Record<
  string,
  {
    cargoName: string;
    unit: string;
    models: {modelId: BSON.ObjectId; modelName: string; quantity: string}[];
  }
>;

interface DetailsListProps {
  inboundDetails: Details;
  expandedCargoIds: string[];
  toggleAccordion: (cargoId: string) => void;
}

const DetailsList: React.FC<DetailsListProps> = ({
  inboundDetails,
  expandedCargoIds,
  toggleAccordion,
}) => (
  <FlatList
    data={Object.values(inboundDetails)}
    keyExtractor={item => item.cargoName}
    renderItem={({item}) => (
      <ListItem.Accordion
        key={item.cargoName}
        containerStyle={{backgroundColor: colorStyle.neutral200}}
        bottomDivider
        content={
          <ListItem.Content>
            <ListItem.Title
              style={{fontSize: 16, fontWeight: 'bold', paddingLeft: 16}}>
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
              color={'grey'}
            />
            <ListItem.Content>
              <ListItem.Title>{model.modelName}</ListItem.Title>
              <ListItem.Subtitle>
                数量: {model.quantity} {item.unit}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ListItem.Accordion>
    )}
  />
);

export default DetailsList;
