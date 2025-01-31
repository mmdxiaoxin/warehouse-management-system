export type RootStackParamList = {
  Home: undefined;
  AddCargo: undefined;
  AddModel: {cargoId: string} | undefined;
  EditCargo: {cargoId: string};
};
