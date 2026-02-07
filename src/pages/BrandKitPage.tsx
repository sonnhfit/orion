import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { BrandList } from '../components/BrandList';
import '../styles/BrandKitPage.css';

export const BrandKitPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="brand-kit-container">
        <BrandList />
      </div>
    </MainLayout>
  );
};
