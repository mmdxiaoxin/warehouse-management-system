import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from '@rneui/themed';
import AddCargoScreen from '../screens/AddCargoScreen';
import AddModelScreen from '../screens/AddModelScreen';
import EditCargoScreen from '../screens/EditCargoScreen';
import EditModelScreen from '../screens/EditModelScreen';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ManagementScreen from '../screens/ManagementScreen';
import {RootStackParamList, RootTabParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// 定义主页的 Tab 导航器
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home';
          let type = 'antdesign';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Management') {
            iconName = 'package';
            type = 'material-community';
          } else if (route.name === 'Inventory') {
            iconName = 'warehouse';
            type = 'material';
          }

          return <Icon name={iconName} size={size} color={color} type={type} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: '首页'}}
      />
      <Tab.Screen
        name="Management"
        component={ManagementScreen}
        options={{
          title: '货品',
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: '库存',
        }}
      />
    </Tab.Navigator>
  );
};

// 主导航器
export default function AppNavigator() {
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
      <Stack.Screen
        name="EditModel"
        component={EditModelScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
