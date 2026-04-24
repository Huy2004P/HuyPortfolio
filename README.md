# 🚀 Huy Portfolio - Frontend

Đây là phần frontend cho dự án trang web Portfolio cá nhân của Huy, được xây dựng bằng **React**, **Vite** và **Tailwind CSS**. Ứng dụng cung cấp giao diện hiển thị thông tin cá nhân, các dự án (Projects), bài viết blog (Blog), và trang liên hệ, đồng thời tích hợp một hệ thống quản trị nội dung (Admin Dashboard) để dễ dàng quản lý dữ liệu.

## ✨ Các tính năng chính

### 👤 Dành cho người dùng (Khách truy cập)
- **Trang chủ (Home):** Hiển thị thông tin tổng quan, tiêu đề và sub-headline cá nhân.
- **Dự án (Projects):** Hiển thị danh sách các dự án đã thực hiện cùng với công nghệ sử dụng và liên kết.
- **Blog:** Đọc các bài viết, chia sẻ kiến thức.
- **Chi tiết bài viết (Post Detail):** Đọc nội dung chi tiết của một bài viết cụ thể.
- **Liên hệ (Contact):** Giao diện liên hệ.
- **Chế độ sáng/tối (Dark/Light Mode):** Tích hợp chuyển đổi chủ đề màu sắc, hỗ trợ tự động theo hệ thống và lưu trữ vào `localStorage`.
- **Thiết kế Apple-inspired:** Giao diện tối giản, hiện đại, mang phong cách thiết kế tương tự các sản phẩm của Apple.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Đăng nhập bảo mật:** Tuyến đường bảo vệ (Protected Route) với JWT token.
- **Quản lý Hồ sơ (Profile Info):** Cập nhật tiêu đề, sub-headline, tech stack, và ảnh đại diện (hỗ trợ upload ảnh).
- **Quản lý Dự án (Projects):** Thêm, sửa, xóa dự án, tải lên hình ảnh minh họa cho dự án.
- **Quản lý Blog (Posts):** Viết bài bằng trình soạn thảo văn bản phong phú (React Quill), tải lên ảnh bìa, lưu nháp hoặc xuất bản.
- **Quản lý Tài khoản (Account Settings):** Thay đổi mật khẩu quản trị.

## 🛠️ Công nghệ sử dụng

- **Core:** [React 18](https://react.dev/), [Vite 8](https://vitejs.dev/), [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v3.4](https://tailwindcss.com/) cùng với `@tailwindcss/typography`
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Biểu tượng (Icons):** [Lucide React](https://lucide.dev/) & [Heroicons](https://heroicons.com/)
- **Trình soạn thảo (Rich Text Editor):** [React Quill](https://github.com/zenoamaro/react-quill)
- **Xử lý thời gian:** [date-fns](https://date-fns.org/)

## 📂 Cấu trúc thư mục

```text
frontend/
├── public/               # File tĩnh không qua bundle
├── src/
│   ├── assets/           # Hình ảnh, fonts, v.v.
│   ├── components/       # Các component có thể tái sử dụng (VD: Layout)
│   ├── pages/            # Các trang giao diện (Home, Projects, Blog, Admin...)
│   ├── App.jsx           # Component gốc, định nghĩa các tuyến đường (Routes)
│   ├── api.js            # Cấu hình Axios & Interceptors
│   ├── index.css         # Reset CSS & cấu hình lớp Tailwind
│   └── main.jsx          # Entry point của ứng dụng
├── eslint.config.js      # Cấu hình ESLint
├── tailwind.config.js    # Cấu hình Tailwind, định nghĩa theme màu sắc (Apple theme)
├── package.json          # Thông tin dự án và thư viện phụ thuộc
└── vite.config.js        # Cấu hình Vite
```

## ⚙️ Cài đặt và khởi chạy (Local Development)

### 1. Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- Npm hoặc Yarn

### 2. Cài đặt các thư viện (Dependencies)
Mở terminal tại thư mục `frontend` và chạy:
```bash
npm install
```

### 3. Cấu hình Backend API
Mặc định, ứng dụng được cấu hình tại file `src/api.js` để tự động nhận dạng môi trường:
- Nếu chạy ở `localhost`: Gửi request đến `http://localhost:5000/api`
- Nếu chạy trên production: Gửi request đến `https://huyportfoliobe.onrender.com/api`

*(Hãy đảm bảo backend của bạn đang chạy ở cổng 5000 khi phát triển ở local).*

### 4. Khởi chạy ứng dụng
```bash
npm run dev
```
Ứng dụng sẽ chạy tại `http://localhost:5173`.

## 📦 Build cho Production

Để tối ưu hóa mã nguồn trước khi deploy:
```bash
npm run build
```
Thư mục `dist/` sẽ được tạo ra, chứa các file tĩnh đã được tối ưu hóa để có thể host trên Vercel, Netlify, hoặc bất kỳ static hosting nào.
