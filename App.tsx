import {NavigationContainer} from '@react-navigation/native';
import {RealmProvider} from '@realm/react';
import React from 'react';
import {Cargo} from './models/Cargo';
import {Category} from './models/Category';
import {Model} from './models/Model';
import {Record} from './models/Record';
import {Unit} from './models/Unit';
import AppNavigator from './routes';

function App(): React.JSX.Element {
  return (
    <RealmProvider schema={[Cargo, Model, Unit, Category, Record]}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </RealmProvider>
  );
}

export default App;
