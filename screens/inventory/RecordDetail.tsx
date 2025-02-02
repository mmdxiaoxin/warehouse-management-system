import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RecordDetailProps} from '../../routes/types';
import {Button} from '@rneui/themed';

export default function RecordDetail({navigation}: RecordDetailProps) {
  return (
    <View style={styles.container}>
      <Button
        title="开始入库"
        onPress={() => navigation.navigate('InboundManage')}
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
});
