import {NavigationContainer} from '@react-navigation/native';
import {RealmProvider} from '@realm/react';
import React from 'react';
import {Cargo} from './models/Cargo';
import {CargoItem} from './models/CargoItem';
import AppNavigator from './routes';

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
