// src/pages/SeriesRouter.tsx
import { Route, Routes } from 'react-router-dom';
import Series from './Series';
import SeriesDetails from './SeriesDetails';

export default function SeriesRouter() {
  return (
    <Routes>
      <Route path="/" element={<Series />} />
      <Route path="/:id" element={<SeriesDetails />} />
    </Routes>
  );
}