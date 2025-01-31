import AntDesignIcon from '@react-native-vector-icons/ant-design';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RealmProvider} from '@realm/react';
import React from 'react';
import {Cargo} from './models/Cargo';
import {CargoItem} from './models/CargoItem';
import AddCargoScreen from './screens/AddCargoScreen';
import AddModelScreen from './screens/AddModelScreen';
import EditCargoScreen from './screens/EditCargoScreen';
import HomeScreen from './screens/HomeScreen';
import InventoryScreen from './screens/InventoryScreen';
import StoreScreen from './screens/StoreScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 定义主页的 Tab 导航器
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: 'home' | 'credit-card' | 'database' = 'home';

          if (route.name === '主页') {
            iconName = 'home';
          } else if (route.name === '仓管') {
            iconName = 'credit-card';
          } else if (route.name === '库存') {
            iconName = 'database';
          }

          return <AntDesignIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="主页" component={HomeScreen} />
      <Tab.Screen name="仓管" component={StoreScreen} />
      <Tab.Screen name="库存" component={InventoryScreen} />
    </Tab.Navigator>
  );
};

// 主导航器
const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddCargo"
        component={AddCargoScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditCargo"
        component={EditCargoScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddModel"
        component={AddModelScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

function App(): React.JSX.Element {
  return (
    <RealmProvider schema={[Cargo, CargoItem]}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </RealmProvider>
  );
}

export default App;
