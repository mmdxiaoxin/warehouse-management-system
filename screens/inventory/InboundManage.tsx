import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {InboundManageProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function InboundManage({navigation}: InboundManageProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.sectionHeader}>入库管理</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: colorStyle.info,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 8,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
