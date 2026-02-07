import React, { useState } from 'react';
import {
  IoToggle,
  IoClose,
  IoAdd,
  IoCheckmark,
} from 'react-icons/io5';
import type { SocialMediaChannel } from '../types/content';
import '../styles/ContentConfig.css';

interface ContentConfigProps {
  channels: SocialMediaChannel[];
  postsPerWeek?: number;
  onUpdateChannels: (channels: SocialMediaChannel[]) => void;
  onUpdatePostsPerWeek: (count: number) => void;
  isSaving?: boolean;
}

export const ContentConfig: React.FC<ContentConfigProps> = ({
  channels,
  postsPerWeek = 3,
  onUpdateChannels,
  onUpdatePostsPerWeek,
  isSaving = false,
}) => {
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialMediaChannel['platform']>('facebook');

  const platformLabels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
  };

  const platformEmojis = {
    facebook: '📘',
    instagram: '📷',
    tiktok: '🎵',
    linkedin: '💼',
    twitter: '𝕏',
  };

  const handleAddChannel = () => {
    const newChannel: SocialMediaChannel = {
      id: `channel_${Date.now()}`,
      platform: selectedPlatform,
      name: platformLabels[selectedPlatform],
      icon: selectedPlatform,
      enabled: true,
      autoPost: false,
      connectedAt: new Date().toISOString(),
    };
    onUpdateChannels([...channels, newChannel]);
    setShowAddChannel(false);
  };

  const handleRemoveChannel = (channelId: string) => {
    onUpdateChannels(channels.filter((ch) => ch.id !== channelId));
  };

  const handleToggleChannel = (channelId: string, field: 'enabled' | 'autoPost') => {
    onUpdateChannels(
      channels.map((ch) => {
        if (ch.id === channelId) {
          return { ...ch, [field]: !ch[field] };
        }
        return ch;
      })
    );
  };

  const getChannelIcon = (platform: SocialMediaChannel['platform']) => {
    return <span className="platform-icon">{platformEmojis[platform]}</span>;
  };

  const availablePlatforms = Object.keys(platformLabels).filter(
    (p) => !channels.some((ch) => ch.platform === p)
  );

  return (
    <div className="content-config">
      <div className="config-section">
        <h3 className="section-title">Cấu hình nội dung tự động</h3>

        <div className="config-item">
          <label>Bài viết mỗi tuần</label>
          <div className="input-group">
            <input
              type="number"
              min="1"
              max="30"
              value={postsPerWeek}
              onChange={(e) => onUpdatePostsPerWeek(parseInt(e.target.value))}
              disabled={isSaving}
            />
            <span className="input-suffix">bài</span>
          </div>
        </div>
      </div>

      <div className="config-section">
        <div className="section-header">
          <h3 className="section-title">Kênh mạng xã hội</h3>
          <button
            className="btn-add"
            onClick={() => setShowAddChannel(true)}
            disabled={isSaving || availablePlatforms.length === 0}
            title="Thêm kênh"
          >
            <IoAdd /> Thêm kênh
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="empty-state">
            <p>Chưa kết nối kênh nào</p>
            <span>Kết nối kênh mạng xã hội để tự động đăng nội dung</span>
          </div>
        ) : (
          <div className="channels-list">
            {channels.map((channel) => (
              <div key={channel.id} className="channel-item">
                <div className="channel-header">
                  <div className="channel-info">
                    {getChannelIcon(channel.platform)}
                    <div className="channel-details">
                      <h4 className="channel-name">{channel.name}</h4>
                      {channel.followers && (
                        <span className="channel-followers">{channel.followers.toLocaleString()} người theo dõi</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveChannel(channel.id)}
                    disabled={isSaving}
                    title="Xóa kênh"
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="channel-controls">
                  <div className="toggle-control">
                    <span className="control-label">Kích hoạt</span>
                    <button
                      className={`toggle-btn ${channel.enabled ? 'enabled' : ''}`}
                      onClick={() => handleToggleChannel(channel.id, 'enabled')}
                      disabled={isSaving}
                      title={channel.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    >
                      <IoToggle />
                    </button>
                  </div>

                  <div className="toggle-control">
                    <span className="control-label">Tự động đăng</span>
                    <button
                      className={`toggle-btn ${channel.autoPost ? 'enabled' : ''}`}
                      onClick={() => handleToggleChannel(channel.id, 'autoPost')}
                      disabled={isSaving || !channel.enabled}
                      title={channel.autoPost ? 'Tắt tự động đăng' : 'Bật tự động đăng'}
                    >
                      <IoToggle />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddChannel && availablePlatforms.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowAddChannel(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm kênh mạng xã hội</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddChannel(false)}
                title="Đóng"
              >
                <IoClose />
              </button>
            </div>

            <div className="modal-body">
              <label>Chọn nền tảng</label>
              <div className="platform-selector">
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform}
                    className={`platform-option ${selectedPlatform === platform ? 'selected' : ''}`}
                    onClick={() => setSelectedPlatform(platform as SocialMediaChannel['platform'])}
                  >
                    {getChannelIcon(platform as SocialMediaChannel['platform'])}
                    <span>{platformLabels[platform as keyof typeof platformLabels]}</span>
                    {selectedPlatform === platform && <IoCheckmark className="check-icon" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowAddChannel(false)}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                className="btn-confirm"
                onClick={handleAddChannel}
                disabled={isSaving}
              >
                {isSaving ? 'Đang xử lý...' : 'Thêm kênh'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
