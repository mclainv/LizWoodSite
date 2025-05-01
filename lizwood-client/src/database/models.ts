import mongoose from 'mongoose';
import { Position as PositionType } from '../types/types';

const PositionSchema = new mongoose.Schema<PositionType>({
  path: String,
  alt: String,
  ogWidth: Number,
  ogHeight: Number,
  defaultPosition: {
    x: Number,
    y: Number,
    z: Number,
    rotated: Number,
    width: Number,
    height: Number,
  },
});

const HomePosition = mongoose.model('HomePosition', PositionSchema);
const MusicPosition = mongoose.model('MusicPosition', PositionSchema);
const FineArtPosition = mongoose.model('FineArtPosition', PositionSchema);
const ConceptPosition = mongoose.model('ConceptPosition', PositionSchema);
const DirectionPosition = mongoose.model('DirectionPosition', PositionSchema);

export { 
  HomePosition,
  MusicPosition,
  FineArtPosition,
  ConceptPosition,
  DirectionPosition
};