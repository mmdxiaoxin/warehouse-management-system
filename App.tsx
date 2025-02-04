import {NavigationContainer} from '@react-navigation/native';
import {RealmProvider} from '@realm/react';
import React from 'react';
import {Brand, Cargo, Category, Model, Record, Unit} from './models';
import {RecordDetail, RecordDetailModel} from './models/Record';

import AppNavigator from './routes';
function App(): React.JSX.Element {
  return (
    <RealmProvider
      schema={[
        Cargo,
        Model,
        Unit,
        Category,
        Brand,
        Record,
        RecordDetail,
        RecordDetailModel,
      ]}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </RealmProvider>
  );
}

export default App;
