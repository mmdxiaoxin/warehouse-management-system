import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {CargoClassifyProps} from '../../../routes/types';
import {fontStyle} from '../../../styles';

export default function CargoClassify({navigation, route}: CargoClassifyProps) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>种类管理</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
  },
});
