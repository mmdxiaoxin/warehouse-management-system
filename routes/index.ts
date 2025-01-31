export type RootStackParamList = {
  HomeTabs: undefined;
  AddCargo: undefined;
  AddModel: {cargoId: string} | undefined;
  EditCargo: {cargoId: string};
};

export type RootTabParamList = {
  Home: undefined;
  Management: undefined;
  Inventory: undefined;
};

export type RootParamList = RootTabParamList & RootStackParamList;
