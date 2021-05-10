import { Dispatch, SetStateAction } from 'react';
import {
  Manner, Place, Height, Frontness,
} from './ipaData';

export type ConsonantTableProps = {
  manners: Manner[];
  setManners: Dispatch<SetStateAction<Manner[]>>;
  places: Place[];
  setPlaces: Dispatch<SetStateAction<Place[]>>;
  editable: boolean;
};

export type VowelTableProps = {
  heights: Height[];
  setHeights: Dispatch<SetStateAction<Height[]>>;
  frontnesses: Frontness[];
  setFrontnesses: Dispatch<SetStateAction<Frontness[]>>;
  editable: boolean;
};

export type IpaTableProps = ConsonantTableProps & VowelTableProps;
