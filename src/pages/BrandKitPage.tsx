import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import {
  IoAdd,
  IoEllipsisVertical,
  IoCheckmarkCircle,
  IoPencil,
  IoTrash,
  IoClose,
  IoBrushSharp
} from 'react-icons/io5';
import '../styles/BrandKitPage.css';

interface Brand {
  id: string;
  name: string;
  description: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;
}

export const BrandKitPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: '1',
      name: 'My Tech Startup',
      description: 'A modern tech company focused on AI solutions',
      logo: '🚀',
      primaryColor: '#0066FF',
      secondaryColor: '#FF6B35',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Design Studio',
      description: 'Creative design and branding services',
      logo: '🎨',
      primaryColor: '#FF1493',
      secondaryColor: '#FFD700',
      createdAt: '2024-02-01'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primaryColor: '#0066FF',
    secondaryColor: '#FF6B35'
  });

  const handleOpenModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      description: '',
      primaryColor: '#0066FF',
      secondaryColor: '#FF6B35'
    });
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      primaryColor: brand.primaryColor,
      secondaryColor: brand.secondaryColor
    });
    setIsModalOpen(true);
  };

  const handleDeleteBrand = (id: string) => {
    setBrands(brands.filter(brand => brand.id !== id));
  };

  const handleSaveBrand = () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thương hiệu');
      return;
    }

    if (editingBrand) {
      setBrands(brands.map(brand =>
        brand.id === editingBrand.id
          ? {
              ...brand,
              name: formData.name,
              description: formData.description,
              primaryColor: formData.primaryColor,
              secondaryColor: formData.secondaryColor
            }
          : brand
      ));
    } else {
      const newBrand: Brand = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        createdAt: new Date().toISOString().split('T')[0],
        logo: '✨'
      };
      setBrands([...brands, newBrand]);
    }

    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  return (
    <MainLayout>
      <div className="brand-kit-container">
        <div className="brand-kit-header">
          <div>
            <h1 className="brand-kit-title">BrandKit</h1>
            <p className="brand-kit-subtitle">Quản lý các thương hiệu của bạn</p>
          </div>
          <button className="brand-kit-add-button" onClick={handleOpenModal}>
            <IoAdd className="button-icon" />
            <span>Thêm thương hiệu mới</span>
          </button>
        </div>

        {brands.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IoBrushSharp />
            </div>
            <h2>Không có thương hiệu nào</h2>
            <p>Tạo thương hiệu đầu tiên của bạn để bắt đầu quản lý</p>
            <button className="empty-state-button" onClick={handleOpenModal}>
              <IoAdd /> Tạo thương hiệu đầu tiên
            </button>
          </div>
        ) : (
          <div className="brands-grid">
            {brands.map(brand => (
              <div key={brand.id} className="brand-card">
                <div className="brand-card-header">
                  <div className="brand-logo">{brand.logo}</div>
                  <div className="brand-menu">
                    <button className="menu-button">
                      <IoEllipsisVertical />
                    </button>
                    <div className="dropdown-menu">
                      <button onClick={() => handleEditBrand(brand)}>
                        <IoPencil /> Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="delete-option"
                      >
                        <IoTrash /> Xóa
                      </button>
                    </div>
                  </div>
                </div>

                <div className="brand-info">
                  <h3 className="brand-name">{brand.name}</h3>
                  <p className="brand-description">{brand.description}</p>
                </div>

                <div className="brand-colors">
                  <div className="color-box">
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: brand.primaryColor }}
                    ></div>
                    <span className="color-label">Màu chính</span>
                  </div>
                  <div className="color-box">
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: brand.secondaryColor }}
                    ></div>
                    <span className="color-label">Màu phụ</span>
                  </div>
                </div>

                <div className="brand-footer">
                  <span className="created-date">
                    Tạo lúc: {new Date(brand.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <IoCheckmarkCircle className="status-icon" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingBrand ? 'Chỉnh sửa thương hiệu' : 'Tạo thương hiệu mới'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  <IoClose />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="brand-name">Tên thương hiệu</label>
                  <input
                    id="brand-name"
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên thương hiệu"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="brand-description">Mô tả</label>
                  <textarea
                    id="brand-description"
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Nhập mô tả thương hiệu"
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="primary-color">Màu chính</label>
                    <div className="color-input-wrapper">
                      <input
                        id="primary-color"
                        type="color"
                        value={formData.primaryColor}
                        onChange={e =>
                          setFormData({ ...formData, primaryColor: e.target.value })
                        }
                      />
                      <span className="color-value">{formData.primaryColor}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="secondary-color">Màu phụ</label>
                    <div className="color-input-wrapper">
                      <input
                        id="secondary-color"
                        type="color"
                        value={formData.secondaryColor}
                        onChange={e =>
                          setFormData({ ...formData, secondaryColor: e.target.value })
                        }
                      />
                      <span className="color-value">{formData.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-button" onClick={handleCloseModal}>
                  Hủy bỏ
                </button>
                <button className="save-button" onClick={handleSaveBrand}>
                  {editingBrand ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
