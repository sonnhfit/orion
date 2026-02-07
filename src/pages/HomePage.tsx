import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { 
  IoVideocam,
  IoFilm,
  IoImage,
  IoBrush,
  IoBulb,
  IoMic,
  IoRadio,
  IoBook,
  IoTv,
  IoPlay,
  IoAdd
} from 'react-icons/io5';
import '../styles/HomePageContent.css';

export const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <section className="hero-banner">
        <h1 className="banner-title">Tạo bất cứ thứ gì bằng AI theo cách của bạn</h1>
        <p className="banner-subtitle">
          Bạn có thể tùy chọn tạo từ đầu, sử dụng mẫu có sẵn hoặc một số công cụ AI thần thánh.
        </p>
        <div className="content-tabs">
          <button className="tab-button active">
            <IoFilm className="tab-icon" />
            Video
          </button>
          <button className="tab-button">
            <IoImage className="tab-icon" />
            Hình ảnh
          </button>
        </div>
      </section>

      <section className="tools-section">
        <h2 className="section-heading">Có thể bạn muốn thử</h2>
        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-image">
              <div className="placeholder-image"><IoVideocam /></div>
              <button className="add-button"><IoAdd /></button>
            </div>
            <h3 className="tool-title">Video mới</h3>
          </div>

          <div className="tool-card">
            <div className="tool-image">
              <div className="placeholder-image"><IoFilm /></div>
            </div>
            <h3 className="tool-title">Công cụ tạo video bằng AI</h3>
            <span className="badge">Mới</span>
          </div>

          <div className="tool-card">
            <div className="tool-image">
              <div className="placeholder-image"><IoBrush /></div>
            </div>
            <h3 className="tool-title">Phụ đề bằng AI</h3>
            <span className="badge">Mới</span>
          </div>

          <div className="tool-card">
            <div className="tool-image">
              <div className="placeholder-image"><IoBulb /></div>
            </div>
            <h3 className="tool-title">Lên ý tưởng cùng AI</h3>
            <span className="badge">Mới</span>
          </div>
        </div>
      </section>

      <section className="templates-section">
        <h2 className="section-heading">Tạo giọng lồng tiếng bằng AI từ văn bản hoặc âm thanh</h2>
        <div className="templates-grid">
          <div className="template-card">
            <div className="template-image podcast">
              <IoMic className="template-icon" />
              <span className="template-label"><IoRadio /> Podcast</span>
              <button className="play-button"><IoPlay /></button>
              <span className="template-status">Dùng thử ngay</span>
            </div>
          </div>

          <div className="template-card">
            <div className="template-image story">
              <IoBook className="template-icon" />
              <span className="template-label"><IoBook /> Story</span>
              <button className="play-button"><IoPlay /></button>
              <span className="template-status">Dùng thử ngay</span>
            </div>
          </div>

          <div className="template-card">
            <div className="template-image advertisement">
              <IoTv className="template-icon" />
              <span className="template-label"><IoTv /> Advertisement</span>
              <button className="play-button"><IoPlay /></button>
              <span className="template-status">Dùng thử ngay</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-templates-section">
        <h2 className="section-heading">Sáng tạo đơn giản hơn với mẫu do AI tạo</h2>
        <div className="template-tabs">
          <button className="template-tab active">Mẫu mới</button>
          <button className="template-tab">Câu chuyện hư cấu</button>
          <button className="template-tab">Sự thật bạn chưa biết</button>
        </div>
      </section>
    </MainLayout>
  );
};
