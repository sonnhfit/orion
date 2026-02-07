# Layout Components

Các component layout có thể tái sử dụng cho toàn bộ ứng dụng.

## Cấu trúc

```
layout/
├── MainLayout.tsx    # Layout chính bao gồm Sidebar + Navbar + Content
├── Sidebar.tsx       # Menu sidebar với navigation
├── Navbar.tsx        # Top navigation bar
└── README.md         # Tài liệu này
```

## Cách sử dụng

### MainLayout Component

Wrap component này xung quanh nội dung của các trang để có layout thống nhất với sidebar và navbar.

```tsx
import { MainLayout } from '../components/layout/MainLayout';

export const YourPage: React.FC = () => {
  return (
    <MainLayout>
      {/* Nội dung trang của bạn ở đây */}
      <div>
        <h1>Tiêu đề trang</h1>
        <p>Nội dung...</p>
      </div>
    </MainLayout>
  );
};
```

### Features

- **Responsive Design**: Tự động điều chỉnh layout cho mobile, tablet, và desktop
- **Mobile Menu**: Hamburger menu cho mobile với overlay
- **Collapsible Sidebar**: Sidebar có thể thu gọn/mở rộng
- **Sticky Navbar**: Navbar luôn cố định ở trên cùng
- **Scrollable Content**: Nội dung có thể scroll độc lập

### Ví dụ

Xem `src/pages/HomePage.tsx` để tham khảo cách sử dụng MainLayout.

## CSS Styles

Mỗi component có file CSS riêng trong `src/styles/layout/`:

- `MainLayout.css` - Styles cho layout wrapper và content body
- `Sidebar.css` - Styles cho sidebar và navigation items
- `Navbar.css` - Styles cho top navbar

## Customization

Để tùy chỉnh sidebar hoặc navbar, bạn có thể:

1. Chỉnh sửa trực tiếp component trong `src/components/layout/`
2. Override CSS trong file tương ứng trong `src/styles/layout/`
3. Truyền props bổ sung (nếu cần mở rộng component)

## Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 769px - 1024px  
- **Mobile**: ≤ 768px
- **Small Mobile**: ≤ 480px
- **Extra Small**: ≤ 360px
