import {Button} from '@rneui/themed';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {InboundRecordProps} from '../../routes/types';

export default function InboundRecord({navigation}: InboundRecordProps) {
  return (
    <FlatList
      style={styles.container}
      keyExtractor={() => 'empty'}
      data={[]}
      ListHeaderComponent={
        <Button
          title="开始入库"
          onPress={() => navigation.navigate('InboundManage')}
        />
      }
      renderItem={() => <View />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});
