import {Button, Icon, ListItem} from '@rneui/themed';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {Record, RecordDetail, RecordDetailModel} from '../../models/Record';
import {InboundRecordProps} from '../../routes/types';
import {colorStyle} from '../../styles';
import RecordItem from '../../components/RecordItem';

// 假设我们有一些示例记录数据
const sampleRecords: Record[] = [
  {
    _id: new BSON.ObjectId(),
    type: 'inbound',
    status: true,
    detail: [
      {
        cargoId: new BSON.ObjectId(),
        cargoName: '货品 A',
        cargoModels: [
          {modelId: new BSON.ObjectId(), modelName: '规格 A1', quantity: 10},
          {modelId: new BSON.ObjectId(), modelName: '规格 A2', quantity: 20},
        ],
        unit: '件',
      },
    ],
    ctime: new Date(),
    utime: new Date(),
  },
  // 更多示例数据...
];

export default function InboundRecord({navigation}: InboundRecordProps) {
  return (
    <FlatList
      style={styles.container}
      keyExtractor={item => item._id.toString()}
      data={sampleRecords}
      ListHeaderComponent={
        <Button
          title="开始入库"
          onPress={() => navigation.navigate('InboundManage')}
          buttonStyle={styles.startButton}
        />
      }
      renderItem={({item}) => <RecordItem item={item} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  startButton: {
    backgroundColor: colorStyle.primary,
    marginBottom: 16,
  },
});
