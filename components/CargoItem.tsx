// CargoItem.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// 定义 props 类型
interface CargoItemProps {
  item: any;
  handleUpdateStatus: (cargoId: string, newStatus: string) => void;
  handleDeleteCargo: (cargoId: string) => void;
}

const CargoItem: React.FC<CargoItemProps> = ({
  item,
  handleUpdateStatus,
  handleDeleteCargo,
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardStatus}>{item.status}</Text>
    </View>

    <View style={styles.cardBody}>
      <Text style={styles.cardText}>Origin: {item.origin}</Text>
      <Text style={styles.cardText}>Destination: {item.destination}</Text>
      <Text style={styles.cardText}>
        Shipping Date:{' '}
        {item.shippingDate instanceof Date
          ? item.shippingDate.toLocaleDateString()
          : 'Invalid Date'}
      </Text>
      <Text style={styles.cardText}>
        Estimated Arrival:{' '}
        {item.estimatedArrival instanceof Date
          ? item.estimatedArrival.toLocaleDateString()
          : 'Invalid Date'}
      </Text>
    </View>

    <View style={styles.cardFooter}>
      <TouchableOpacity
        style={styles.buttonShipped}
        onPress={() => handleUpdateStatus(item.cargoId, 'Shipped')}>
        <Text style={styles.buttonText}>Mark as Shipped</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonDelete}
        onPress={() => handleDeleteCargo(item.cargoId)}>
        <Text style={styles.buttonText}>删除货物</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Android
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
  },
  cardBody: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonShipped: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CargoItem;
