/**
 * Quảng Trị Travel Guide — Single Page Application
 * Designed & Developed by: Lê Thị Hoài Linh
 * Stack: React (Vite) + Tailwind CSS + Lucide React + Framer Motion
 *
 * CHANGELOG v2:
 * - Cập nhật ảnh thật địa điểm (link thực tế từ yêu cầu)
 * - Thêm Image Modal popup phóng to ảnh (điều hướng prev/next)
 * - Bổ sung 5 món đặc sản đầy đủ ảnh thật
 * - Fix YouTube ID: p4ZscHw666A
 * - Footer © 2026
 * - Tối ưu Framer Motion: viewport once:true, bỏ animation thừa
 * - Custom cursor dùng RAF thay vì state để không lag
 */

import { useState, useRef, useEffect } from "react";
import {
  motion, useInView, useMotionValue, useSpring, AnimatePresence,
} from "framer-motion";
import {
  MapPin, Clock, DollarSign, Menu, X,
  ChevronDown, Star, Wind, Camera, Utensils, Map,
  Play, Pause, Calendar, Thermometer, ArrowRight,
  ZoomIn, ChevronLeft, ChevronRight,
} from "lucide-react";

// =============================================================================
// TRAVEL_DATA — Chỉnh sửa toàn bộ nội dung tại đây
// =============================================================================
const TRAVEL_DATA = {
  meta: {
    designer: "Lê Thị Hoài Linh",
    title: "Quảng Trị: Bản Hùng Ca Của Đất Và Lửa",
  },

  nav: [
    { label: "Câu Chuyện", href: "#story" },
    { label: "Địa Điểm",   href: "#locations" },
    { label: "Ẩm Thực",    href: "#food" },
    { label: "Video",      href: "#video" },
    { label: "Bản Đồ",    href: "#map" },
    { label: "Lịch Trình", href: "#budget" },
  ],

  // ── ĐỊA ĐIỂM ──────────────────────────────────────────────────────────────
  locations: [
    {
      id: 1,
      name: "Thành Cổ Quảng Trị",
      category: "Di tích lịch sử",
      description:
        "Chứng nhân của 81 ngày đêm lửa máu năm 1972. Thành Cổ không chỉ là phế tích chiến tranh mà còn là nghĩa trang không mộ chí của hàng ngàn chiến sĩ kiên trung. Bước qua cổng thành là bước vào ký ức đau thương và hào hùng nhất của dân tộc.",
      detail:
        "Thành Cổ được xây từ thời Nguyễn (1809), hình vuông mỗi cạnh 550 m, tường thành dày 12 m. Trận chiến 81 ngày đêm mùa hè 1972 khiến hơn 10.000 chiến sĩ hy sinh — trung bình mỗi ngày hứng 1.000 quả bom và hàng chục ngàn viên đạn pháo.",
      highlight: "Hơn 10.000 chiến sĩ hy sinh trong 81 ngày đêm",
      openHours: "07:00 – 18:00 hàng ngày",
      image: "https://lalago.vn/wp-content/uploads/2025/07/Thanh-co-Quang-Tri-7.jpg",
      imageFallback: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80",
      color: "#b45309",
      icon: "🏛️",
    },
    {
      id: 2,
      name: "Địa Đạo Vịnh Mốc",
      category: "Di tích kháng chiến",
      description:
        "Hệ thống địa đạo dài 1,9 km nằm sâu 10–30 m dưới lòng đất, nơi hơn 350 người thuộc 60 gia đình sinh sống suốt 6 năm kháng chiến. Kỳ tích phi thường của ý chí con người trước bom đạn tàn khốc.",
      detail:
        "Đào từ 1966–1967, gồm 3 tầng và 13 cửa ra vào (7 ra biển, 6 lên đồi). Bên trong có hội trường, trạm xá, giếng nước và bếp Hoàng Cầm. 17 em bé đã chào đời ngay trong lòng địa đạo.",
      highlight: "17 em bé chào đời trong lòng địa đạo",
      openHours: "07:30 – 17:30 hàng ngày",
      image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/101/075/articles/vm-5c18fd7b-6bf8-4b01-939b-8e9cb3959de0.jpg?v=1557391446250",
      imageFallback: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80",
      color: "#92400e",
      icon: "⛏️",
    },
    {
      id: 3,
      name: "Thánh Địa La Vang",
      category: "Di tích tôn giáo",
      description:
        "Trung tâm hành hương Công giáo lớn nhất Việt Nam với lịch sử hơn 220 năm. Vương Cung Thánh Đường uy nghiêm giữa rừng cây cổ thụ xanh mát là điểm tâm linh linh thiêng bậc nhất Đông Dương.",
      detail:
        "Gắn với sự kiện Đức Mẹ hiện ra năm 1798 với các tín hữu đang lẩn trốn bắt bớ. Đại hội hành hương quốc tế tổ chức mỗi 3 năm thu hút hàng triệu người từ khắp thế giới.",
      highlight: "Đại hội hành hương quốc tế mỗi 3 năm một lần",
      openHours: "Mở cửa suốt ngày — miễn phí vào cửa",
      image: "https://hanhhuongducmelavang.com/wp-content/uploads/2024/08/gioi-thieu-852.jpg",
      imageFallback: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=1200&q=80",
      color: "#78350f",
      icon: "⛪",
    },
    {
      id: 4,
      name: "Mũi Trèo — Hoàng Hôn Hướng Tây",
      category: "Thiên nhiên kỳ thú",
      description:
        "Điểm cực Tây duy nhất của đường bờ biển Việt Nam nơi mặt trời lặn xuống mặt biển hướng Tây — hiện tượng địa lý độc nhất vô nhị trên toàn quốc. Hoàng hôn Mũi Trèo được xem là đẹp nhất Đông Dương.",
      detail:
        "Thuộc xã Vĩnh Thái, Vĩnh Linh, cách Đông Hà ~75 km. Do địa hình bờ biển uốn cong đặc biệt, đây là nơi duy nhất tại Việt Nam có thể chiêm ngưỡng mặt trời lặn trên mặt biển theo hướng Tây.",
      highlight: "Nơi duy nhất VN xem hoàng hôn trên biển hướng Tây",
      openHours: "Đẹp nhất 17:00 – 18:30 — miễn phí",
      image: "https://images.vietnamtourism.gov.vn/vn//images/2021/bien_mui_treo1.jpg",
      imageFallback: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
      color: "#c2410c",
      icon: "🌅",
    },
    {
      id: 5,
      name: "Đảo Cồn Cỏ",
      category: "Biển đảo hoang sơ",
      description:
        "Hòn đảo anh hùng giữa Biển Đông với hệ sinh thái san hô nguyên vẹn và phong phú nhất miền Trung. Nước biển trong xanh như ngọc bích, cát trắng tinh khôi và không khí trong lành chưa bị khai thác ồ ạt.",
      detail:
        "Cách đất liền 28 hải lý, diện tích 4 km², được công nhận huyện đảo năm 2004. Rạn san hô tại đây thuộc loại hiếm với độ phủ cao — thiên đường cho lặn ngắm san hô, câu cá và chụp ảnh dưới nước.",
      highlight: "San hô nguyên sinh đa dạng nhất vùng biển miền Trung",
      openHours: "Tàu xuất phát 07:00 từ cảng Cửa Tùng",
      image: "https://ipa.quangtri.gov.vn/uploads/xuc-tien-du-lich/2020_06/image-20200605161847-1.jpeg",
      imageFallback: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
      color: "#0369a1",
      icon: "🏝️",
    },
  ],

  // ── ẨM THỰC (5 món + ảnh thật) ────────────────────────────────────────────
  food: [
    {
      id: 1,
      name: "Bánh Khoái Quảng Trị",
      description:
        "Phiên bản Quảng Trị giòn rụm hơn bánh khoái Huế, nhân tôm thịt tươi ngon, ăn kèm rau sống xanh mướt và nước lèo gia truyền đặc quánh đậm vị không nơi nào có.",
      price: "25.000 – 40.000đ",
      mustTry: true,
      image: "https://cms.junglebosstours.com/assets/52e653de-075f-40d6-93f6-66f20443ff30?width=1024&height=575",
      color: "#f59e0b",
      where: "Chợ thị xã Quảng Trị, Đông Hà",
    },
    {
      id: 2,
      name: "Thịt Trâu Lá Trơng",
      description:
        "Đặc sản người dân tộc Vân Kiều vùng Trường Sơn. Thịt trâu tươi gói kín lá trơng rừng, nướng than hoa chậm — vị ngọt tự nhiên hòa quyện hương rừng núi hoang sơ độc đáo.",
      price: "80.000 – 150.000đ",
      mustTry: true,
      image: "https://ipa.quangtri.gov.vn/uploads/xuc-tien-du-lich/2019_11/image-20191129160204-2.jpeg",
      color: "#ef4444",
      where: "Nhà hàng Đông Hà, chợ phiên Khe Sanh",
    },
    {
      id: 3,
      name: "Cháo Bột (Bánh Canh)",
      description:
        "Sợi bánh canh cán tay từ bột gạo xay tươi, nước dùng xương heo ninh nhừ cùng tôm và chả cá đặc trưng. Bát cháo nóng hổi buổi sáng sớm là linh hồn chợ Đông Hà.",
      price: "20.000 – 35.000đ",
      mustTry: false,
      image: "https://quangbinhtravel.vn/wp-content/uploads/2025/08/chao-bot-vit4.jpg",
      color: "#f97316",
      where: "Chợ Đông Hà — mở từ 05:00 sáng",
    },
    {
      id: 4,
      name: "Bún Hến Mai Xá",
      description:
        "Hến đồng tươi làng Mai Xá (Gio Linh) xào sả ớt thơm nức, ăn kèm bún trắng và tương ớt cay xé lưỡi. Vị ngọt thanh của hến hòa quyện nước dùng đậm đà — khó có thể quên.",
      price: "25.000 – 45.000đ",
      mustTry: true,
      image: "https://dulichviet.com.vn/images/bandidau/am-thuc/bun-hen-mai-xa-quang-tri-du-lich-viet-3.jpg",
      color: "#84cc16",
      where: "Làng Mai Xá, Gio Linh — cách ĐH 15 km",
    },
    {
      id: 5,
      name: "Gà Chỉ Cam Lộ",
      description:
        "Giống gà bản địa nuôi thả đồi Cam Lộ, thịt chắc và ngọt hơn gà công nghiệp rất nhiều. Luộc lá chanh hoặc nướng muối ớt mộc mạc — đủ khiến thực khách nhớ mãi mỗi lần ghé Quảng Trị.",
      price: "120.000 – 250.000đ/kg",
      mustTry: true,
      image: "https://bazantravel.com/cdn/medias/uploads/30/30172-ga-chi-700x467.jpg",
      color: "#d97706",
      where: "Huyện Cam Lộ & các nhà hàng Đông Hà",
    },
  ],

  // ── LỊCH TRÌNH ─────────────────────────────────────────────────────────────
  itinerary: [
    {
      day: 1,
      title: "Ngày 1: Hành Trình Về Ký Ức",
      color: "#b45309",
      activities: [
        { time: "07:00", activity: "Khởi hành từ Đà Nẵng / Huế đến Đông Hà (~2 giờ xe)" },
        { time: "09:00", activity: "Tham quan Thành Cổ Quảng Trị & Bảo tàng tỉnh" },
        { time: "11:30", activity: "Ghé Thánh địa La Vang (cách 5 km)" },
        { time: "13:00", activity: "Trưa: Bánh khoái tại chợ thị xã Quảng Trị" },
        { time: "14:30", activity: "Địa đạo Vịnh Mốc (60 phút trong lòng đất)" },
        { time: "17:00", activity: "Ngắm biển Cửa Tùng buổi chiều" },
        { time: "19:00", activity: "Tối: Thịt trâu lá trơng & bún hến tại Đông Hà" },
      ],
    },
    {
      day: 2,
      title: "Ngày 2: Thiên Nhiên & Biển Khơi",
      color: "#0369a1",
      activities: [
        { time: "05:30", activity: "Dậy sớm, cháo bột chợ Đông Hà" },
        { time: "07:00", activity: "Tàu cao tốc ra đảo Cồn Cỏ từ cảng Cửa Tùng (45 phút)" },
        { time: "09:00", activity: "Lặn ngắm san hô, tắm biển, khám phá đảo" },
        { time: "14:00", activity: "Tàu về đất liền, nghỉ ngơi tại Đông Hà" },
        { time: "16:00", activity: "Di chuyển đến Mũi Trèo (75 km, ~1.5 giờ)" },
        { time: "17:30", activity: "Ngắm hoàng hôn hướng Tây độc nhất Việt Nam" },
        { time: "20:00", activity: "Gà Chỉ Cam Lộ nướng — kết thúc hành trình" },
      ],
    },
  ],

  // ── CHI PHÍ ────────────────────────────────────────────────────────────────
  budget: [
    { item: "Di chuyển (xe máy thuê hoặc taxi)",   cost: "200.000 – 500.000đ/ngày" },
    { item: "Tàu ra đảo Cồn Cỏ (khứ hồi)",         cost: "250.000đ/người" },
    { item: "Vé tham quan các di tích",              cost: "20.000 – 50.000đ/điểm" },
    { item: "Ăn uống 3 bữa",                         cost: "150.000 – 300.000đ/ngày" },
    { item: "Khách sạn 2–3 sao tại Đông Hà",         cost: "300.000 – 600.000đ/đêm" },
    { item: "Tổng dự tính 2 ngày 1 đêm",             cost: "1.200.000 – 2.500.000đ" },
  ],

  weather: [
    { season: "Tháng 4–8",  icon: "☀️", note: "Nắng nóng, Gió Lào khô hanh — SPF 50+ bắt buộc" },
    { season: "Tháng 9–11", icon: "🌧️", note: "Mưa lũ miền Trung — hạn chế ra đảo Cồn Cỏ" },
    { season: "Tháng 12–3", icon: "🌤️", note: "Mát dịu — thời điểm lý tưởng nhất để thăm Quảng Trị" },
  ],

  // YouTube ID đã xác minh hoạt động
  videoEmbedId: "p4ZscHw666A",

  // Google Maps Thành Cổ / trung tâm Quảng Trị
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30264.134506432584!2d107.17562456764609!3d16.815927374618808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141b95c5e3b5f79%3A0x4a9f53c4c5d7b1a0!2zVGjDoG5oIHBo4buRIFF14bqjbmcgVHLhu4k!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn",

  musicUrl:
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk",
};

// =============================================================================
// ANIMATION VARIANTS — tối giản để tránh lag
// =============================================================================
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// Viewport dùng chung — once:true là quan trọng nhất để tránh re-animate
const VP = { once: true, margin: "-60px" };

// =============================================================================
// REVEAL WRAPPER
// =============================================================================
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// =============================================================================
// IMAGE MODAL — popup phóng to, điều hướng prev / next
// =============================================================================
const ImageModal = ({ item, items, onClose }) => {
  const list = items || [item];
  const [idx, setIdx] = useState(list.findIndex((x) => x.id === item.id));
  const cur = list[idx];

  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);
  const next = () => setIdx((i) => (i + 1) % list.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-4xl"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{ scale: 0.92,    opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          <X size={16} /> Đóng (Esc)
        </button>

        {/* Image area */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shadow-black/60">
          <img
            src={cur.image}
            alt={cur.name}
            className="w-full max-h-[62vh] object-cover"
            onError={(e) => { if (cur.imageFallback) e.target.src = cur.imageFallback; }}
          />

          {list.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {idx + 1} / {list.length}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              {cur.category && (
                <div className="text-orange-400 text-[11px] font-semibold uppercase tracking-widest mb-1">
                  {cur.category}
                </div>
              )}
              <h3 className="text-white text-xl font-bold mb-2">{cur.name}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {cur.detail || cur.description}
              </p>
            </div>
            {cur.openHours && (
              <div className="shrink-0 flex items-center gap-1.5 text-slate-400 text-xs bg-slate-800 rounded-xl px-3 py-2">
                <Clock size={12} /> {cur.openHours}
              </div>
            )}
          </div>
          {cur.highlight && (
            <div className="mt-3 flex items-start gap-2 bg-orange-900/30 border border-orange-700/30 rounded-xl p-3">
              <Star size={13} className="text-orange-400 mt-0.5 shrink-0" />
              <span className="text-orange-200 text-xs">{cur.highlight}</span>
            </div>
          )}
          {/* Food-specific */}
          {cur.price && (
            <div className="mt-3 flex items-center gap-2">
              <DollarSign size={13} className="text-orange-400" />
              <span className="text-orange-300 text-sm font-semibold">{cur.price}</span>
              {cur.where && <span className="text-slate-500 text-xs">— {cur.where}</span>}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// =============================================================================
// CUSTOM CURSOR — dùng RAF thay vì useState để tránh lag khi di chuột nhanh
// =============================================================================
const CustomCursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const posRef   = useRef({ x: -200, y: -200 });
  const hovRef   = useRef(false);

  useEffect(() => {
    // Di chuột — lưu vào ref, không setState
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    // Hover detection
    const onOver = (e) => { hovRef.current = !!e.target.closest("button, a, [data-cursor='hover']"); };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    // RAF loop — cập nhật DOM trực tiếp, không qua React state
    let raf;
    const tick = () => {
      const { x, y } = posRef.current;
      const hov = hovRef.current;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${x - 4}px, ${y - 4}px)`;
      const size = hov ? 48 : 32;
      if (ringRef.current) ringRef.current.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      if (ringRef.current) {
        ringRef.current.style.width  = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.borderColor = hov ? "#f97316" : "rgba(249,115,22,0.45)";
        ringRef.current.style.backgroundColor = hov ? "rgba(249,115,22,0.1)" : "transparent";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Không hiện trên mobile
  if (typeof window !== "undefined" && window.matchMedia("(max-width:768px)").matches) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-orange-500 pointer-events-none z-[9999] mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border-2 pointer-events-none z-[9998]"
        style={{ willChange: "transform", transition: "width 0.18s, height 0.18s, border-color 0.18s, background-color 0.18s" }}
      />
    </>
  );
};

// =============================================================================
// MUSIC PLAYER
// =============================================================================
const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-orange-500/30 rounded-full px-4 py-3 shadow-2xl"
      data-cursor="hover"
    >
      {/* Waveform visualizer */}
      <div className="flex items-end gap-[3px] h-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-orange-400"
            animate={
              playing
                ? { height: ["4px", `${8 + i * 3}px`, "4px"], opacity: [0.6, 1, 0.6] }
                : { height: "4px", opacity: 0.3 }
            }
            transition={playing ? { duration: 0.5 + i * 0.09, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 } : {}}
          />
        ))}
      </div>
      <span className="text-orange-300 text-xs font-medium hidden sm:block">
        {playing ? "Đang phát..." : "Nhạc nền"}
      </span>
      <button
        onClick={() => setPlaying(!playing)}
        className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-400 transition-colors"
        data-cursor="hover"
      >
        {playing ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
      </button>
      {playing && (
        <iframe src={TRAVEL_DATA.musicUrl} className="hidden" allow="autoplay" title="ambient-music" />
      )}
    </motion.div>
  );
};

// =============================================================================
// NAVBAR
// =============================================================================
const Navbar = () => {
  const [open, setOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Throttle: chỉ update khi vượt ngưỡng
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const go = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-400 ${
        scrolled ? "bg-slate-900/85 backdrop-blur-2xl border-b border-orange-500/20 shadow-xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.04 }}
            title="Quảng Trị Travel Guide"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-sm font-black text-white shadow-md">
              QT
            </div>
            <span className="text-white font-bold tracking-tight hidden sm:block">Quảng Trị</span>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {TRAVEL_DATA.nav.map((n) => (
              <button key={n.href} onClick={() => go(n.href)}
                className="text-white/70 hover:text-orange-400 text-sm font-medium transition-colors"
                data-cursor="hover"
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* Hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)} data-cursor="hover">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/96 backdrop-blur-2xl border-t border-orange-500/20"
          >
            <div className="px-6 py-3 flex flex-col">
              {TRAVEL_DATA.nav.map((n) => (
                <button key={n.href} onClick={() => go(n.href)}
                  className="text-white/75 hover:text-orange-400 text-base font-medium text-left py-3 border-b border-white/5 transition-colors"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// =============================================================================
// HERO
// =============================================================================
const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
    {/* Animated gradient blobs — will-change để GPU handle */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-1/3 -left-1/4 w-[65%] h-[65%] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #b45309 0%, transparent 70%)", willChange: "transform" }}
        animate={{ x: [0, 22, 0], y: [0, -14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/3 -right-1/4 w-[55%] h-[55%] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #c2410c 0%, transparent 70%)", willChange: "transform" }}
        animate={{ x: [0, -16, 0], y: [0, 10, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] h-[38%] rounded-full opacity-10 blur-[140px]"
        style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)", willChange: "transform" }}
        animate={{ scale: [1, 1.14, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,.5) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(249,115,22,.5) 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>

    {/* Hero bg image */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=70')" }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950" />

    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.2 }}
        className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-2 mb-8"
      >
        <MapPin size={13} className="text-orange-400" />
        <span className="text-orange-300 text-[11px] font-semibold tracking-widest uppercase">
          Vĩ tuyến 17 — Quảng Trị, Việt Nam
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none mb-6"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        <span style={{
          background: "linear-gradient(135deg, #fff 0%, #fde68a 35%, #f97316 68%, #b45309 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Quảng Trị
        </span>
        <span className="block text-3xl sm:text-4xl md:text-5xl font-light text-white/80 mt-3">
          Bản Hùng Ca Của Đất Và Lửa
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.65 }}
        className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
      >
        Nơi từng là ranh giới của hai miền đất nước, nay là biểu tượng bất diệt
        về ý chí và khát vọng hòa bình của dân tộc Việt Nam.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          onClick={() => document.querySelector("#story")?.scrollIntoView({ behavior: "smooth" })}
          whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(249,115,22,0.42)" }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-700 text-white font-bold px-8 py-4 rounded-full shadow-xl"
          data-cursor="hover"
        >
          Khám Phá Ngay <ChevronDown size={16} />
        </motion.button>
        <motion.button
          onClick={() => document.querySelector("#locations")?.scrollIntoView({ behavior: "smooth" })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/18 transition-all"
          data-cursor="hover"
        >
          <MapPin size={14} /> Xem Địa Điểm
        </motion.button>
      </motion.div>
    </div>

    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
      animate={{ y: [0, 7, 0] }}
      transition={{ duration: 2.3, repeat: Infinity }}
    >
      <span className="text-white/25 text-[10px] tracking-widest uppercase">Cuộn xuống</span>
      <ChevronDown size={17} className="text-orange-400/40" />
    </motion.div>
  </section>
);

// =============================================================================
// STORY
// =============================================================================
const Story = () => (
  <section id="story" className="py-24 lg:py-36 bg-amber-50 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500/40 to-transparent" />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-px bg-orange-500" />
          <span className="text-orange-600 font-semibold tracking-widest text-xs uppercase">Câu Chuyện Lịch Sử</span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-10"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Vĩ Tuyến 17 &{" "}
          <span style={{
            background: "linear-gradient(135deg, #b45309, #f97316)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Khát Vọng Hòa Bình
          </span>
        </h2>
      </Reveal>

      <div className="space-y-7 text-slate-700 leading-[1.9] text-lg">
        <Reveal delay={0.12}>
          <p>
            Năm 1954, Hiệp định Genève chia đôi nước Việt Nam theo vĩ tuyến 17. Dòng sông Bến Hải —
            một con sông hiền hòa giữa lòng đất Quảng Trị — bỗng trở thành đường phân cách bi thương
            nhất lịch sử. Cầu Hiền Lương nhuốm màu chia ly, hai bờ Nam-Bắc cách nhau chỉ vài chục mét
            mà xa vời vợi như ngàn dặm.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="border-l-4 border-orange-500 pl-7 py-2 bg-orange-50 rounded-r-2xl">
            <p className="text-slate-900 font-semibold italic">
              "Quảng Trị từng chịu đựng mật độ bom đạn dày đặc nhất trong lịch sử chiến tranh thế giới
              hiện đại — trung bình 7 tấn bom cho mỗi người dân. Nhưng không gì có thể bẻ gãy ý chí
              của con người nơi đây."
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <p>
            Từ tro than và đổ nát, Quảng Trị đã vươn mình đứng dậy. Hôm nay, "vùng đất lửa" cũng
            là "vùng đất hoa" — hoàng hôn Mũi Trèo độc nhất vô nhị, san hô nguyên sinh Cồn Cỏ và
            rừng núi Đakrông xanh thẳm hòa quyện cùng di sản văn hóa tâm linh ngàn năm, mời gọi
            những người yêu lịch sử và thiên nhiên tìm về.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.32}>
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { num: "81",    sub: "Ngày đêm lửa máu 1972",     color: "#b45309" },
            { num: "1.9km", sub: "Đường hầm Vịnh Mốc",         color: "#c2410c" },
            { num: "220+",  sub: "Năm lịch sử Thánh địa La Vang", color: "#78350f" },
            { num: "7 tấn", sub: "Bom / người dân Quảng Trị",  color: "#92400e" },
          ].map((s) => (
            <div key={s.num} className="text-center p-5 bg-white rounded-2xl shadow-sm border border-orange-100">
              <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.num}</div>
              <div className="text-slate-600 text-xs leading-snug">{s.sub}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

// =============================================================================
// LOCATION CARD
// =============================================================================
const LocationCard = ({ location, index, onOpen, allLocations }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 28 });
  const sy = useSpring(my, { stiffness: 220, damping: 28 });

  const onMouseMove  = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left  - r.width  / 2) / 10);
    my.set((e.clientY - r.top   - r.height / 2) / 10);
  };
  const onMouseLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: Math.min(index * 0.08, 0.28) }}
      whileHover={{ y: -6 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-orange-900/20 transition-shadow duration-400"
      data-cursor="hover"
    >
      {/* Image + parallax */}
      <div
        className="relative h-52 overflow-hidden cursor-pointer"
        onClick={() => onOpen(location, allLocations)}
      >
        <motion.div style={{ x: sx, y: sy, scale: 1.08 }} className="w-full h-full">
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { if (location.imageFallback) e.target.src = location.imageFallback; }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 to-transparent" />
        {/* Zoom overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
            <ZoomIn size={20} className="text-white" />
          </div>
        </div>
        <div
          className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-white text-[10px] font-semibold"
          style={{ backgroundColor: `${location.color}cc` }}
        >
          {location.category}
        </div>
        <span className="absolute top-3 right-3 text-2xl">{location.icon}</span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-700 transition-colors">
          {location.name}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{location.description}</p>
        <div className="flex items-start gap-2 bg-orange-50 rounded-xl p-3 mb-4">
          <Star size={12} className="text-orange-500 mt-0.5 shrink-0" />
          <span className="text-orange-800 text-xs font-medium">{location.highlight}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Clock size={11} /> <span>{location.openHours}</span>
          </div>
          <button
            onClick={() => onOpen(location, allLocations)}
            className="flex items-center gap-1 text-orange-600 text-xs font-semibold hover:gap-2 transition-all"
            data-cursor="hover"
          >
            Xem thêm <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// LOCATIONS SECTION
// =============================================================================
const Locations = () => {
  const [modal, setModal] = useState(null);

  return (
    <section id="locations" className="py-24 lg:py-36 bg-slate-950 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 55%, rgba(180,83,9,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 85% 20%, rgba(194,65,12,0.06) 0%, transparent 50%)`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-5">
              <MapPin size={12} className="text-orange-400" />
              <span className="text-orange-300 text-[10px] font-semibold tracking-widest uppercase">Địa Điểm Nổi Bật</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Những Điểm Đến{" "}
              <span style={{
                background: "linear-gradient(135deg, #f97316, #b45309)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Không Thể Bỏ Qua
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Nhấn vào từng địa điểm hoặc nút "Xem thêm" để xem thông tin chi tiết và ảnh phóng to.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAVEL_DATA.locations.map((loc, i) => (
            <LocationCard
              key={loc.id}
              location={loc}
              index={i}
              allLocations={TRAVEL_DATA.locations}
              onOpen={(item, items) => setModal({ item, items })}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && <ImageModal item={modal.item} items={modal.items} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </section>
  );
};

// =============================================================================
// FOOD CARD
// =============================================================================
const FoodCard = ({ dish, index, onOpen }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: Math.min(index * 0.08, 0.28) }}
      whileHover={{ y: -5, scale: 1.015 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-orange-100 transition-all duration-400 cursor-pointer"
      onClick={() => onOpen(dish)}
      data-cursor="hover"
    >
      {/* Real food photo */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        {dish.mustTry && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
            Must Try ★
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span
            className="text-[10px] font-semibold px-2 py-1 rounded-full text-white backdrop-blur-sm"
            style={{ backgroundColor: `${dish.color}bb` }}
          >
            {dish.where}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-[15px] mb-2 group-hover:text-orange-700 transition-colors leading-tight">
          {dish.name}
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed mb-3 line-clamp-2">{dish.description}</p>
        <div className="flex items-center gap-1.5">
          <DollarSign size={12} className="text-orange-500" />
          <span className="text-orange-700 text-sm font-bold">{dish.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// FOOD SECTION
// =============================================================================
const Food = () => {
  const [modal, setModal] = useState(null);

  return (
    <section id="food" className="py-24 lg:py-36 bg-amber-50 relative overflow-hidden">
      <div
        className="absolute right-0 bottom-0 w-72 h-72 opacity-[0.07] blur-3xl rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/30 rounded-full px-4 py-2 mb-5">
              <Utensils size={12} className="text-orange-600" />
              <span className="text-orange-700 text-[10px] font-semibold tracking-widest uppercase">Ẩm Thực Đặc Sản</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Hương Vị{" "}
              <span style={{
                background: "linear-gradient(135deg, #b45309, #f97316)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Quảng Trị
              </span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              5 đặc sản tiêu biểu — nhấn vào từng món để xem thông tin chi tiết và hình ảnh phóng to.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {TRAVEL_DATA.food.map((dish, i) => (
            <FoodCard
              key={dish.id}
              dish={dish}
              index={i}
              onOpen={(d) => setModal({ item: d, items: TRAVEL_DATA.food })}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && <ImageModal item={modal.item} items={modal.items} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </section>
  );
};

// =============================================================================
// VIDEO & MAP
// =============================================================================
const VideoAndMap = () => (
  <section className="py-24 lg:py-36 bg-slate-950 relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: "radial-gradient(circle at 0% 100%, rgba(180,83,9,0.07) 0%, transparent 50%)" }}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* VIDEO */}
        <div id="video">
          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 flex items-center justify-center">
                <Camera size={14} className="text-red-400" />
              </div>
              <div>
                <div className="text-white font-bold">Cinematic Quảng Trị</div>
                <div className="text-slate-400 text-xs">Video giới thiệu du lịch</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <motion.div
              whileHover={{ scale: 1.008 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/30 border border-orange-500/20"
              style={{ paddingBottom: "56.25%", height: 0 }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${TRAVEL_DATA.videoEmbedId}?rel=0&modestbranding=1`}
                title="Quảng Trị Travel Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>

        {/* MAP */}
        <div id="map">
          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-orange-600/20 flex items-center justify-center">
                <Map size={14} className="text-orange-400" />
              </div>
              <div>
                <div className="text-white font-bold">Bản Đồ Quảng Trị</div>
                <div className="text-slate-400 text-xs">Thành Cổ & trung tâm tỉnh</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <motion.div
              whileHover={{ scale: 1.008 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/30 border border-orange-500/20"
              style={{ height: 400 }}
            >
              <iframe
                src={TRAVEL_DATA.mapEmbedUrl}
                className="w-full h-full"
                title="Quảng Trị Map"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

// =============================================================================
// BUDGET & TIPS
// =============================================================================
const BudgetAndTips = () => (
  <section id="budget" className="py-24 lg:py-36 bg-amber-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/30 rounded-full px-4 py-2 mb-5">
            <Calendar size={12} className="text-orange-600" />
            <span className="text-orange-700 text-[10px] font-semibold tracking-widest uppercase">Lịch Trình & Chi Phí</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Hành Trình{" "}
            <span style={{
              background: "linear-gradient(135deg, #b45309, #f97316)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              2 Ngày 1 Đêm
            </span>
          </h2>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          {TRAVEL_DATA.itinerary.map((day, di) => (
            <Reveal key={day.day} delay={di * 0.1}>
              <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-50">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: day.color }}
                  >
                    D{day.day}
                  </div>
                  <h3 className="font-bold text-slate-900">{day.title}</h3>
                </div>
                <div className="space-y-3">
                  {day.activities.map((act, ai) => (
                    <div key={ai} className="flex gap-3">
                      <div
                        className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 mt-0.5 tabular-nums"
                        style={{ backgroundColor: `${day.color}14`, color: day.color }}
                      >
                        {act.time}
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{act.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Budget + Weather */}
        <div className="space-y-5">
          <Reveal delay={0.12}>
            <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-50">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={14} className="text-orange-600" />
                <h3 className="font-bold text-slate-900">Chi Phí Dự Tính</h3>
              </div>
              <div className="space-y-1">
                {TRAVEL_DATA.budget.map((b, i) => {
                  const last = i === TRAVEL_DATA.budget.length - 1;
                  return (
                    <div key={i}
                      className={`flex justify-between items-start gap-2 text-xs py-2.5 ${
                        last ? "bg-orange-50 rounded-xl px-3 mt-2" : "border-b border-slate-50"
                      }`}
                    >
                      <span className={last ? "font-bold text-orange-800" : "text-slate-600"}>{b.item}</span>
                      <span className={`shrink-0 ${last ? "font-black text-orange-600" : "font-semibold text-slate-900"}`}>{b.cost}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-50">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer size={14} className="text-orange-600" />
                <h3 className="font-bold text-slate-900">Thời Tiết</h3>
              </div>
              <div className="space-y-2">
                {TRAVEL_DATA.weather.map((w, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className="text-lg">{w.icon}</span>
                    <div>
                      <div className="text-slate-900 font-semibold text-xs">{w.season}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5 leading-snug">{w.note}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="flex items-start gap-2">
                  <Wind size={13} className="text-orange-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-orange-800 font-bold text-xs mb-1">⚠️ Chú ý Gió Lào</div>
                    <div className="text-orange-700 text-[11px] leading-relaxed">
                      Tháng 4–8 nhiệt độ vượt 40°C. Mang SPF 50+, uống đủ nước và
                      tránh ra ngoài từ 11:00–15:00.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

// =============================================================================
// FOOTER — © 2026 + Bản quyền Nguyễn Quân tinh tế
// =============================================================================
const Footer = () => (
  <footer className="bg-slate-950 border-t border-orange-500/10 py-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-white font-black shadow-lg"
              title="Quảng Trị Travel Guide"
            >
              QT
            </div>
            <div>
              <div className="text-white font-bold">Quảng Trị Guide</div>
              <div className="text-slate-500 text-xs">Travel & Heritage</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Website du lịch phi lợi nhuận, tạo ra với tình yêu và sự trân trọng dành
            cho vùng đất lịch sử thiêng liêng này.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Khám Phá</h4>
          <div className="space-y-2">
            {TRAVEL_DATA.nav.map((n) => (
              <button key={n.href}
                onClick={() => document.querySelector(n.href)?.scrollIntoView({ behavior: "smooth" })}
                className="block text-slate-400 hover:text-orange-400 text-sm transition-colors"
                data-cursor="hover"
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Designer */}
        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Tác Giả</h4>
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/20 rounded-2xl p-5">
            <div className="text-white font-bold text-lg mb-1">Lê Thị Hoài Linh</div>
            <div className="text-orange-400 text-sm mb-3">Frontend Developer & Designer</div>
            <div className="text-slate-400 text-xs leading-relaxed">
              Thiết kế & phát triển với đam mê về du lịch và lịch sử Việt Nam.
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-xs text-center sm:text-left">
          © 2026 Quảng Trị Travel Guide. Thiết kế bởi{" "}
          <span className="text-orange-400 font-semibold">Lê Thị Hoài Linh</span>
          <span className="inline-block ml-1 opacity-20 hover:opacity-100 transition-opacity duration-300">
            & Nguyễn Quân
          </span>
          . All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <span>Made with</span>
          <span className="text-red-500">♥</span>
          <span>for Việt Nam</span>
        </div>
      </div>
    </div>
  </footer>
);

// =============================================================================
// APP ROOT
// =============================================================================
export default function App() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen" style={{ cursor: "none" }}>
        <CustomCursor />
        <Navbar />
        <main>
          <Hero />
          <Story />
          <Locations />
          <Food />
          <VideoAndMap />
          <BudgetAndTips />
        </main>
        <Footer />
        <MusicPlayer />
      </div>
    </>
  );
}