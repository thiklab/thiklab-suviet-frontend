# Sử Việt Niên Biểu (Vietnam History Explorer)

Ứng dụng web hiện đại, tối giản và chuyên nghiệp để khám phá và đối chiếu Lịch sử Việt Nam, khai thác nguồn dữ liệu mở từ Wikipedia tiếng Việt (`vi.wikipedia.org`).

---

## 🏛️ Triết lý Thiết kế: Editorial / Warm Paper
- **Bảng màu Warm Paper:** Màu giấy dó dịu mắt (`#FAF7F2`), viền giấy cũ thanh mảnh (`#D4C5A9`), điểm xuyết màu mực nho (`#1E1917`), đỏ son ấn triện (`#8F1D1D`) và đồng cổ (`#966A38`).
- **Typography:** Font Serif cổ điển (`Lora`) đem lại trải nghiệm đọc sách lịch sử trang trọng, tĩnh lặng và không gây mỏi mắt.

---

## ⚡ Các Tính Năng Nổi Bật

### 1. Tam Trục Niên Biểu (Parallel Timeline Matrix)
- Đối chiếu song song 3 luồng lịch sử trong cùng một mốc năm:
  1. **Đại Việt / Việt Nam:** Triều đại, danh tướng, các trận quyết chiến chiến lược.
  2. **Phương Bắc / Trung Hoa:** Triều đại phong kiến đương thời, biến động chính trị.
  3. **Thế giới:** Châu Âu, Châu Mỹ và các bước ngoặt toàn cầu.
- **Responsive:**
  - *Desktop:* Dạng 3 cột song song có trục kết nối trực quan.
  - *Mobile:* Dạng Tab Switcher chuyển đổi mượt mà bằng Framer Motion.
- Tra cứu mốc năm linh hoạt với dữ liệu động từ Wikipedia Action API.

### 2. Bộ Đọc Tĩnh Lặng (Editorial Reader View)
- Bóc tách nội dung HTML bài viết từ Wikipedia Action API.
- Tự động làm sạch các bảng mẫu rườm rà (`infobox`, `navbox`, `reflist`).
- **Sidebar Mục lục cố định (TOC):** Tích hợp Scrollspy tự động bắt vị trí cuộn.
- **Tooltip Hover Preview:** Rê chuột vào liên kết nội bộ để xem tóm tắt & hình ảnh tư liệu ngay lập tức mà không phải rời trang.

### 3. Lộ Trình 5 Kỷ Nguyên (Guided Pathways)
- I. Hồng Bàng & Tiền Sử
- II. Bắc Thuộc & Chống Bắc Thuộc
- III. Quân Chủ Độc Lập
- IV. Pháp Thuộc & Kháng Chiến Giải Phóng
- V. Việt Nam Hiện Đại & Hội Nhập

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

Dự án được lưu tại:
```text
/Users/tuannguyen/Documents/projects/thiklab/suviet
```

### Bước 1: Mở thư mục dự án trong Terminal

```bash
cd /Users/tuannguyen/Documents/projects/thiklab/suviet
```

### Bước 2: Cài đặt các gói phụ thuộc

```bash
npm install
# hoặc nếu dùng pnpm:
pnpm install
# hoặc nếu dùng yarn:
yarn install
```

### Bước 3: Chạy môi trường phát triển (Dev Server)

```bash
npm run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📂 Cấu trúc Thư mục

```text
suviet/
├── app/
│   ├── globals.css                # CSS typography & màu sắc Warm Paper
│   ├── layout.tsx                 # Root layout & Google Fonts
│   ├── page.tsx                   # Trang chủ giới thiệu
│   ├── pathways/page.tsx          # Lộ trình 5 kỷ nguyên
│   ├── read/[slug]/page.tsx       # Trang Reader View
│   └── timeline/page.tsx          # Trang Tam Trục Niên Biểu
├── components/
│   ├── common/Header.tsx          # Header điều hướng
│   ├── reader/ReaderView.tsx      # Bộ đọc tư liệu + TOC + Preview Popover
│   └── timeline/ParallelTimeline.tsx # Dòng thời gian 3 trục
├── lib/
│   ├── constants/eras.ts          # Định nghĩa 5 kỷ nguyên
│   ├── constants/milestones.ts    # Dữ liệu đối chiếu chuẩn (938, 1288, 1789, 1945...)
│   └── wikipedia/
│       ├── cleaner.ts             # Bộ lọc HTML Wikipedia & TOC extractor
│       ├── client.ts              # Fetch REST & Action API
│       └── yearParser.ts          # Bóc tách sự kiện 3 trục theo từ khóa
├── types/history.ts               # TypeScript schemas
├── tailwind.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```
