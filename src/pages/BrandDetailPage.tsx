import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { BrandDetail } from '../components/BrandDetail';

export const BrandDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <BrandDetail />
    </MainLayout>
  );
};
