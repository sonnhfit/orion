# Orion - AI Marketing Automation Platform

Orion là nền tảng AI automation giúp xây dựng thương hiệu và bán hàng tự động.

## 🚀 Tính năng

- ✅ **Xác thực JWT**: Đăng nhập/Đăng ký với JWT tokens
- ✅ **Protected Routes**: Bảo vệ các trang yêu cầu đăng nhập
- ✅ **Landing Page**: Trang giới thiệu với thiết kế hiện đại
- ✅ **Home Page**: Giao diện giống CapCut với sidebar navigation
- ✅ **Token Refresh**: Tự động làm mới access token khi hết hạn
- ✅ **Responsive Design**: Tương thích với mobile và desktop
- ✅ **TypeScript**: Type-safe với TypeScript
- ✅ **React Router**: SPA routing với React Router v6

## 📋 Yêu cầu

- Node.js >= 16
- npm hoặc yarn
- Backend API đang chạy tại `http://localhost:8000/api`

## 🛠️ Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd orion
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

## 📁 Cấu trúc thư mục

```
orion/
├── src/
│   ├── components/          # React components
│   │   ├── AuthModal.tsx    # Modal đăng nhập/đăng ký
│   │   └── ProtectedRoute.tsx # HOC bảo vệ routes
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx  # Trang landing (/)
│   │   └── HomePage.tsx     # Trang home (/home)
│   ├── services/            # API services
│   │   └── api.ts           # API service với axios
│   ├── styles/              # CSS files
│   │   ├── AuthModal.css
│   │   ├── LandingPage.css
│   │   └── HomePage.css
│   ├── types/               # TypeScript types
│   │   └── auth.ts          # Auth-related types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
├── package.json
└── README.md
```

## 🔐 Authentication Flow

### 1. Login/Register

- User nhập thông tin đăng nhập/đăng ký
- API trả về `access_token` và `refresh_token`
- Tokens được lưu trong `localStorage`
- User được redirect đến `/home`

### 2. Protected Routes

- Khi truy cập `/home`, `ProtectedRoute` kiểm tra authentication
- Nếu chưa đăng nhập → redirect về `/`
- Nếu đã đăng nhập → hiển thị nội dung

### 3. Token Refresh

- Khi `access_token` hết hạn (401 error)
- Axios interceptor tự động gọi API refresh token
- Nếu refresh thành công → retry request ban đầu
- Nếu refresh thất bại → logout và redirect về `/`

### 4. Logout

- Xóa tokens khỏi `localStorage`
- Reset authentication state
- Redirect về landing page

## 🔌 API Integration

### Base URL

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

### Endpoints sử dụng

- `POST /auth/login/` - Đăng nhập
- `POST /auth/register/` - Đăng ký
- `GET /auth/me/` - Lấy thông tin user
- `POST /auth/logout/` - Đăng xuất
- `POST /token/refresh/` - Làm mới access token

### Request Headers

```typescript
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 🎨 Pages

### Landing Page (`/`)

- Hero section với CTA buttons
- Features showcase
- Statistics section
- Login/Register modal
- Auto redirect nếu đã đăng nhập

### Home Page (`/home`)

- Sidebar navigation
- Header với user actions
- Hero banner với tabs
- Tools grid
- Templates grid
- AI templates section

## 🧪 Scripts

```bash
# Development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## 📦 Dependencies

### Core

- `react` ^19.2.0
- `react-dom` ^19.2.0
- `react-router-dom` ^7.x
- `axios` ^1.x
- `jwt-decode` ^4.x

### Dev Dependencies

- `typescript` ~5.9.3
- `vite` (rolldown-vite) ^7.2.5
- `@vitejs/plugin-react` ^5.1.1
- `eslint` ^9.39.1

## 🔒 Security Best Practices

1. **Tokens Storage**: Tokens lưu trong `localStorage` (production nên dùng HttpOnly cookies)
2. **HTTPS**: Luôn dùng HTTPS trong production
3. **Token Expiration**: Access token hết hạn sau 24h
4. **Refresh Token**: Refresh token hết hạn sau 30 ngày
5. **Auto Logout**: Tự động logout khi refresh token thất bại

## 🐛 Troubleshooting

### Lỗi CORS

Đảm bảo backend có cấu hình CORS đúng:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Lỗi API Connection

Kiểm tra:
1. Backend đang chạy tại đúng URL
2. File `.env` có cấu hình đúng `VITE_API_URL`
3. Network requests trong DevTools

### Token hết hạn liên tục

Kiểm tra timezone và thời gian hệ thống backend/frontend

## 🚀 Deployment

### Build for production

```bash
npm run build
```

Output: `dist/` folder

### Deploy to Vercel/Netlify

1. Connect repository
2. Set environment variables:
   - `VITE_API_URL=https://api.your-domain.com/api`
3. Build command: `npm run build`
4. Output directory: `dist`

## 📝 TODO

- [ ] Add Google OAuth integration
- [ ] Add Apple Sign-In integration
- [ ] Add email verification
- [ ] Add forgot password
- [ ] Add 2FA
- [ ] Add user profile page
- [ ] Add brands management
- [ ] Add AI content generation
- [ ] Add lead discovery
- [ ] Add automation workflows

## 👥 Team

Orion Team

## 📄 License

All rights reserved © 2024 Orion
