import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { DataSourcesList } from '../components/DataSourcesList';
import '../styles/DataSourcesPage.css';

export const DataSourcesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="data-sources-container">
        <DataSourcesList />
      </div>
    </MainLayout>
  );
};
