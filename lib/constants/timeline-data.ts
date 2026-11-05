export type Lane = "vn" | "cn" | "wd";

export const MIN_YEAR = -2879;
export const MAX_YEAR = 2026;

// [năm, vị trí 0..1] — thước thời gian chia theo 5 thời kỳ, không theo tỷ lệ tuyến tính
export const ANCHORS: [number, number][] = [
  [-2879, 0],
  [-179, 0.1],
  [938, 0.3],
  [1858, 0.68],
  [1945, 0.78],
  [2026, 1],
];

export const ERAS: [string, number][] = [
  ["Hồng Bàng", -2879],
  ["Bắc thuộc", -179],
  ["Quân chủ độc lập", 938],
  ["Pháp thuộc", 1858],
  ["Hiện đại", 1945],
];

export const LANE_NAMES: Record<Lane, string> = {
  vn: "Việt Nam",
  cn: "Trung Quốc",
  wd: "Thế giới",
};

export const LANE_SHORT: Record<Lane, string> = { vn: "VN", cn: "TQ", wd: "TG" };

export const REGIMES: Record<Lane, [number, string][]> = {
  vn: [[-2879, "Hồng Bàng – Văn Lang"], [-257, "Âu Lạc"], [-179, "Nam Việt (Triệu)"], [-111, "Bắc thuộc lần I"], [40, "Hai Bà Trưng"], [43, "Bắc thuộc lần II"], [544, "Tiền Lý – Vạn Xuân"], [602, "Bắc thuộc lần III"], [939, "Nhà Ngô"], [968, "Nhà Đinh"], [980, "Tiền Lê"], [1009, "Nhà Lý"], [1225, "Nhà Trần"], [1400, "Nhà Hồ"], [1407, "Minh thuộc"], [1428, "Hậu Lê sơ"], [1527, "Mạc – Lê Trung hưng"], [1627, "Trịnh–Nguyễn phân tranh"], [1778, "Tây Sơn"], [1802, "Nhà Nguyễn"], [1858, "Pháp thuộc"], [1945, "VN Dân chủ Cộng hòa"], [1976, "CHXHCN Việt Nam"]],
  cn: [[-2879, "Tam Hoàng Ngũ Đế"], [-2070, "Nhà Hạ"], [-1600, "Nhà Thương"], [-1046, "Tây Chu"], [-770, "Xuân Thu"], [-475, "Chiến Quốc"], [-221, "Nhà Tần"], [-202, "Tây Hán"], [9, "Tân"], [25, "Đông Hán"], [220, "Tam Quốc"], [266, "Nhà Tấn"], [420, "Nam–Bắc triều"], [581, "Nhà Tùy"], [618, "Nhà Đường"], [907, "Ngũ đại thập quốc"], [960, "Nhà Tống"], [1271, "Nhà Nguyên"], [1368, "Nhà Minh"], [1644, "Nhà Thanh"], [1912, "Trung Hoa Dân Quốc"], [1949, "CHND Trung Hoa"]],
  wd: [[-2879, "Văn minh sơ khai"], [-800, "Hy Lạp – La Mã cổ"], [-27, "Đế quốc La Mã"], [476, "Trung cổ sơ kỳ"], [622, "Hồi giáo mở rộng"], [1096, "Trung cổ thịnh kỳ"], [1206, "Đế quốc Mông Cổ"], [1453, "Phục hưng & Địa lý"], [1789, "Cách mạng & Công nghiệp"], [1914, "Thế chiến"], [1945, "Chiến tranh Lạnh"], [1991, "Toàn cầu hóa"]],
};

export const EVENTS: [Lane, number, string, string][] = [
  ["vn", -257, "An Dương Vương lập Âu Lạc", "An Dương Vương"], ["vn", -179, "Triệu Đà chiếm Âu Lạc", "Triệu Đà"], ["vn", 40, "Khởi nghĩa Hai Bà Trưng", "Hai Bà Trưng"], ["vn", 248, "Khởi nghĩa Bà Triệu", "Bà Triệu"], ["vn", 544, "Lý Bí lập nước Vạn Xuân", "Lý Nam Đế"], ["vn", 938, "Ngô Quyền thắng Bạch Đằng, chấm dứt Bắc thuộc", "Trận Bạch Đằng (938)"], ["vn", 968, "Đinh Bộ Lĩnh dựng Đại Cồ Việt", "Đinh Tiên Hoàng"], ["vn", 1010, "Lý Thái Tổ dời đô ra Thăng Long", "Chiếu dời đô"], ["vn", 1075, "Lý Thường Kiệt đánh Ung Châu", "Chiến dịch Ung Châu"], ["vn", 1077, "Chiến thắng sông Như Nguyệt", "Trận Như Nguyệt"], ["vn", 1288, "Đại thắng Bạch Đằng, phá quân Nguyên Mông", "Trận Bạch Đằng (1288)"], ["vn", 1400, "Hồ Quý Ly lập nhà Hồ", "Hồ Quý Ly"], ["vn", 1427, "Chi Lăng – Xương Giang, kết thúc khởi nghĩa Lam Sơn", "Khởi nghĩa Lam Sơn"], ["vn", 1471, "Lê Thánh Tông chinh phạt Chiêm Thành", "Lê Thánh Tông"], ["vn", 1789, "Quang Trung đại phá quân Thanh", "Trận Ngọc Hồi - Đống Đa"], ["vn", 1802, "Gia Long lên ngôi, lập nhà Nguyễn", "Gia Long"], ["vn", 1858, "Pháp nổ súng tấn công Đà Nẵng", "Pháp tấn công Đà Nẵng (1858)"], ["vn", 1945, "Cách mạng Tháng Tám, Tuyên ngôn Độc lập", "Cách mạng Tháng Tám"], ["vn", 1954, "Chiến thắng Điện Biên Phủ", "Chiến dịch Điện Biên Phủ"], ["vn", 1975, "Thống nhất đất nước", "Chiến dịch Hồ Chí Minh"], ["vn", 1986, "Khởi xướng Đổi Mới", "Đổi Mới"],
  ["cn", -221, "Tần Thủy Hoàng thống nhất Trung Hoa", "Tần Thủy Hoàng"], ["cn", -202, "Hán Cao Tổ lập nhà Hán", "Hán Cao Tổ"], ["cn", 105, "Thái Luân cải tiến kỹ thuật làm giấy", "Thái Luân"], ["cn", 220, "Nhà Hán sụp đổ, Tam Quốc chia cắt", "Tam Quốc"], ["cn", 589, "Nhà Tùy thống nhất sau thời Nam–Bắc triều", "Nhà Tùy"], ["cn", 618, "Đường Cao Tổ lập nhà Đường", "Đường Cao Tổ"], ["cn", 907, "Nhà Đường diệt vong", "Nhà Đường"], ["cn", 960, "Triệu Khuông Dận lập nhà Tống", "Tống Thái Tổ"], ["cn", 1127, "Tống mất miền Bắc, dời xuống phía Nam", "Nam Tống"], ["cn", 1279, "Nguyên diệt Nam Tống", "Nhà Nguyên"], ["cn", 1368, "Chu Nguyên Chương lập nhà Minh", "Minh Thái Tổ"], ["cn", 1644, "Mãn Thanh vào Bắc Kinh", "Nhà Thanh"], ["cn", 1840, "Chiến tranh Nha phiến lần I", "Chiến tranh Nha phiến lần thứ nhất"], ["cn", 1911, "Cách mạng Tân Hợi", "Cách mạng Tân Hợi"], ["cn", 1949, "Thành lập nước CHND Trung Hoa", "Cộng hòa Nhân dân Trung Hoa"],
  ["wd", -509, "La Mã chuyển sang chế độ cộng hòa", "Cộng hòa La Mã"], ["wd", -27, "Augustus mở đầu Đế quốc La Mã", "Augustus"], ["wd", 476, "Tây La Mã sụp đổ", "Đế quốc Tây La Mã"], ["wd", 622, "Muhammad di cư Medina (Hijra)", "Hijra"], ["wd", 800, "Charlemagne đăng quang hoàng đế", "Charlemagne"], ["wd", 1096, "Cuộc Thập tự chinh thứ nhất", "Thập tự chinh thứ nhất"], ["wd", 1206, "Thành Cát Tư Hãn thống nhất người Mông Cổ", "Thành Cát Tư Hãn"], ["wd", 1347, "Đại dịch Cái chết Đen lan khắp châu Âu", "Cái chết Đen"], ["wd", 1453, "Constantinople thất thủ", "Cuộc vây hãm Constantinopolis (1453)"], ["wd", 1492, "Columbus đến châu Mỹ", "Christopher Columbus"], ["wd", 1517, "Luther khởi xướng Cải cách Kháng nghị", "Martin Luther"], ["wd", 1776, "Mỹ tuyên bố độc lập", "Tuyên ngôn Độc lập Hoa Kỳ"], ["wd", 1789, "Cách mạng Pháp bùng nổ", "Cách mạng Pháp"], ["wd", 1914, "Thế chiến I bắt đầu", "Chiến tranh thế giới thứ nhất"], ["wd", 1939, "Thế chiến II bắt đầu", "Chiến tranh thế giới thứ hai"], ["wd", 1945, "Thế chiến II kết thúc, thành lập Liên Hợp Quốc", "Liên Hợp Quốc"], ["wd", 1969, "Con người đặt chân lên Mặt Trăng", "Apollo 11"], ["wd", 1991, "Liên Xô tan rã", "Sự kiện tan rã Liên Xô"],
];

export const KEY_YEARS = [938, 1075, 1288, 1427, 1789, 1945];

export const WINDOWS = [10, 50, 150, 400];

export const STEPS: [number, string][] = [
  [-50, "−50"], [-10, "−10"], [-1, "−1"], [1, "+1"], [10, "+10"], [50, "+50"],
];

export const formatYear = (y: number) => (y < 0 ? `${-y} TCN` : String(y));

export function yearToPos(y: number): number {
  for (let i = 1; i < ANCHORS.length; i++) {
    if (y <= ANCHORS[i][0]) {
      const [a, b] = ANCHORS[i - 1];
      const [c, d] = ANCHORS[i];
      return b + ((y - a) / (c - a)) * (d - b);
    }
  }
  return 1;
}

export function posToYear(p: number): number {
  for (let i = 1; i < ANCHORS.length; i++) {
    if (p <= ANCHORS[i][1]) {
      const [a, b] = ANCHORS[i - 1];
      const [c, d] = ANCHORS[i];
      return Math.round(a + ((p - b) / (d - b)) * (c - a));
    }
  }
  return MAX_YEAR;
}

export function regimeAt(lane: Lane, y: number): { current: [number, string]; nextStart: number | null } {
  const list = REGIMES[lane];
  let k = 0;
  for (let i = 0; i < list.length; i++) if (list[i][0] <= y) k = i;
  return { current: list[k], nextStart: list[k + 1] ? list[k + 1][0] : null };
}

// Suy ra năm của bài viết từ tiêu đề, mô tả hoặc đoạn mở đầu
export function guessArticleYear(...texts: (string | undefined)[]): number | null {
  const patterns = [/\((?:năm\s*)?(\d{3,4})\)/i, /\bnăm\s+(\d{3,4})\b/i, /\b(\d{3,4})\b/];
  for (const text of texts) {
    if (!text) continue;
    for (const re of patterns) {
      const m = re.exec(text);
      if (m) {
        const y = parseInt(m[1], 10);
        if (y >= 100 && y <= MAX_YEAR) return y;
      }
    }
  }
  return null;
}

export function eventsAroundYear(year: number, excludeTitle: string, win = 50, limit = 8) {
  return EVENTS.filter((e) => e[3] !== excludeTitle && Math.abs(e[1] - year) <= win)
    .sort((a, b) => Math.abs(a[1] - year) - Math.abs(b[1] - year) || a[1] - b[1])
    .slice(0, limit)
    .sort((a, b) => a[1] - b[1]);
}
