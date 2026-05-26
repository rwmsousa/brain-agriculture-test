import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import producersReducer from './slices/producersSlice';
import farmsReducer from './slices/farmsSlice';
import harvestsReducer from './slices/harvestsSlice';
import cropTypesReducer from './slices/cropTypesSlice';
import plantedCropsReducer from './slices/plantedCropsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    producers: producersReducer,
    farms: farmsReducer,
    harvests: harvestsReducer,
    cropTypes: cropTypesReducer,
    plantedCrops: plantedCropsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
