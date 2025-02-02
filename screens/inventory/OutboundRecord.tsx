import {Button} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {OutboundRecordProps} from '../../routes/types';

export default function OutboundRecord({navigation}: OutboundRecordProps) {
  return (
    <View style={styles.container}>
      <Button
        title="开始出库"
        onPress={() => navigation.navigate('OutboundManage')}
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
