import {Icon, ListItem} from '@rneui/themed';
import React from 'react';
import {FlatList} from 'react-native';
import {BSON} from 'realm';

export type Details = Record<
  string,
  {
    cargoName: string;
    models: {modelId: BSON.ObjectId; modelName: string; quantity: string}[];
  }
>;

interface InboundDetailsProps {
  inboundDetails: Details;
  expandedCargoIds: string[];
  toggleAccordion: (cargoId: string) => void;
  unit: string;
}

const DetailsList: React.FC<InboundDetailsProps> = ({
  inboundDetails,
  expandedCargoIds,
  toggleAccordion,
  unit,
}) => (
  <FlatList
    data={Object.values(inboundDetails)}
    keyExtractor={item => item.cargoName}
    renderItem={({item}) => (
      <ListItem.Accordion
        key={item.cargoName}
        content={
          <ListItem.Content>
            <ListItem.Title
              style={{fontSize: 16, fontWeight: 'bold', paddingLeft: 16}}>
              {item.cargoName}
            </ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expandedCargoIds.includes(item.cargoName)}
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
                数量: {model.quantity} {unit}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ListItem.Accordion>
    )}
  />
);

export default DetailsList;
