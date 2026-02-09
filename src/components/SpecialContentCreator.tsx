import React, { useState } from 'react';
import { IoClose, IoImageOutline, IoVideocamOutline, IoAddCircleOutline } from 'react-icons/io5';
import { contentApiService } from '../services/contentApi';
import '../styles/SpecialContentCreator.css';

interface SpecialContentCreatorProps {
  brandId: number;
  onContentCreated?: (content: any) => void;
  onClose?: () => void;
}

export const SpecialContentCreator: React.FC<SpecialContentCreatorProps> = ({
  brandId,
  onContentCreated,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('realistic');
  const [imageSize, setImageSize] = useState('1024x1024');

  // Video composition state
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [videoDuration, setVideoDuration] = useState(3);
  const [videoTransition, setVideoTransition] = useState('fade');

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setError('Vui lòng nhập mô tả cho hình ảnh');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const config = {
        style: imageStyle,
        size: imageSize
      };

      await contentApiService.generateImageFromText(imagePrompt, config);
      
      // Create content with the generated image
      const contentData = {
        brand: brandId,
        content_type: 2, // Assuming 2 is for image content type
        title: `Hình ảnh: ${imagePrompt.substring(0, 50)}...`,
        description: `Hình ảnh được tạo từ mô tả: ${imagePrompt}`,
        content: imagePrompt,
        content_metadata: contentApiService.createImageGenerationMetadata(
          imagePrompt,
          imageStyle,
          imageSize
        )
      };

      const createdContent = await contentApiService.createContent(contentData);
      
      setSuccess('Hình ảnh đã được tạo thành công!');
      onContentCreated?.(createdContent);
      
      // Reset form
      setImagePrompt('');
    } catch (err) {
      setError('Không thể tạo hình ảnh. Vui lòng thử lại.');
      console.error('Error generating image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async () => {
    const validImageUrls = imageUrls.filter(url => url.trim() !== '');
    if (validImageUrls.length === 0) {
      setError('Vui lòng thêm ít nhất một URL hình ảnh');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const config = {
        duration_per_image: videoDuration,
        transition: videoTransition
      };

      await contentApiService.createVideoFromImages(validImageUrls, config);
      
      // Create content with the generated video
      const contentData = {
        brand: brandId,
        content_type: 3, // Assuming 3 is for video content type
        title: `Video từ ${validImageUrls.length} hình ảnh`,
        description: `Video được tạo từ ${validImageUrls.length} hình ảnh`,
        content: `Video composition với ${validImageUrls.length} hình ảnh, mỗi hình ${videoDuration} giây, hiệu ứng chuyển cảnh: ${videoTransition}`,
        content_metadata: contentApiService.createVideoCompositionMetadata(
          validImageUrls,
          videoDuration,
          videoTransition
        )
      };

      const createdContent = await contentApiService.createContent(contentData);
      
      setSuccess('Video đã được tạo thành công!');
      onContentCreated?.(createdContent);
      
      // Reset form
      setImageUrls(['']);
    } catch (err) {
      setError('Không thể tạo video. Vui lòng thử lại.');
      console.error('Error creating video:', err);
    } finally {
      setLoading(false);
    }
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newImageUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newImageUrls);
    }
  };

  return (
    <div className="special-content-creator">
      <div className="creator-header">
        <h2>Tạo Nội dung Đặc biệt</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose} title="Đóng">
            <IoClose />
          </button>
        )}
      </div>

      <div className="creator-tabs">
        <button
          className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          <IoImageOutline /> Tạo ảnh từ text
        </button>
        <button
          className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          <IoVideocamOutline /> Tạo video từ ảnh
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="creator-content">
        {activeTab === 'image' ? (
          <div className="image-generator">
            <div className="form-group">
              <label htmlFor="imagePrompt">Mô tả hình ảnh *</label>
              <textarea
                id="imagePrompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Mô tả chi tiết hình ảnh bạn muốn tạo..."
                rows={4}
              />
              <small className="hint">Mô tả càng chi tiết, hình ảnh càng chính xác</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="imageStyle">Phong cách</label>
                <select
                  id="imageStyle"
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                >
                  <option value="realistic">Thực tế</option>
                  <option value="cartoon">Hoạt hình</option>
                  <option value="painting">Tranh vẽ</option>
                  <option value="minimalist">Tối giản</option>
                  <option value="futuristic">Tương lai</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="imageSize">Kích thước</label>
                <select
                  id="imageSize"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                >
                  <option value="256x256">256x256</option>
                  <option value="512x512">512x512</option>
                  <option value="1024x1024">1024x1024</option>
                  <option value="1792x1024">1792x1024</option>
                  <option value="1024x1792">1024x1792</option>
                </select>
              </div>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerateImage}
              disabled={loading || !imagePrompt.trim()}
            >
              {loading ? 'Đang tạo...' : 'Tạo hình ảnh'}
            </button>
          </div>
        ) : (
          <div className="video-composer">
            <div className="form-group">
              <label>URL hình ảnh *</label>
              {imageUrls.map((url, index) => (
                <div key={index} className="image-url-row">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder={`URL hình ảnh ${index + 1}`}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImageUrl(index)}
                      title="Xóa URL"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-url-btn"
                onClick={addImageUrlField}
              >
                <IoAddCircleOutline /> Thêm hình ảnh
              </button>
              <small className="hint">Thêm URL của hình ảnh để tạo video</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="videoDuration">Thời gian mỗi hình (giây)</label>
                <input
                  id="videoDuration"
                  type="number"
                  min="1"
                  max="10"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="videoTransition">Hiệu ứng chuyển cảnh</label>
                <select
                  id="videoTransition"
                  value={videoTransition}
                  onChange={(e) => setVideoTransition(e.target.value)}
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                  <option value="rotate">Rotate</option>
                  <option value="none">Không có</option>
                </select>
              </div>
            </div>

            <div className="video-preview">
              <h4>Thông tin video:</h4>
              <ul>
                <li>Số hình ảnh: {imageUrls.filter(url => url.trim() !== '').length}</li>
                <li>Thời gian mỗi hình: {videoDuration} giây</li>
                <li>Tổng thời gian: {videoDuration * imageUrls.filter(url => url.trim() !== '').length} giây</li>
                <li>Hiệu ứng chuyển cảnh: {videoTransition}</li>
              </ul>
            </div>

            <button
              className="generate-btn"
              onClick={handleCreateVideo}
              disabled={loading || imageUrls.filter(url => url.trim() !== '').length === 0}
            >
              {loading ? 'Đang tạo...' : 'Tạo video'}
            </button>
          </div>
        )}
      </div>

      <div className="creator-footer">
        <p className="note">
          <strong>Lưu ý:</strong> Nội dung được tạo sẽ được lưu vào hệ thống và cần được duyệt trước khi đăng.
          Thời gian tạo có thể mất vài phút tùy thuộc vào độ phức tạp.
        </p>
      </div>
    </div>
  );
};