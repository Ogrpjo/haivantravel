"use client";

import { useState, useMemo, useRef } from "react";
import { ChevronRight2 } from "@deemlol/next-icons";
import Image from "next/image";
import ButtonGradient from "../button-gradient";

interface ProjectStat {
  number: string;
  name: string;
}

interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  stats: ProjectStat[];
  mainImage: string;
  thumbnail: string;
  link: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    category: "Gala Dinner",
    title: "Lễ Kỷ Niệm 10 Năm Thành Lập — Tập Đoàn Bất Động Sản ABC",
    description: "Tổ chức thành công sự kiện gala dinner hoành tráng cho 1,200 khách hàng doanh nghiệp tại khách sạn 5 sao. Chương trình kết hợp nghệ thuật biểu diễn, trao giải và tiệc buffet cao cấp.",
    stats: [
      { number: "1,200+", name: "Khách tham dự" },
      { number: "15", name: "Nghệ sĩ" },
      { number: "2 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/whychooseus.webp",
    thumbnail: "/home/whychooseus.webp",
    link: "/project/gala-abc"
  },
  {
    id: 2,
    category: "Team Building",
    title: "Chương Trình Kết Nối Sức Mạnh — Liên Minh Công Nghệ TechHub",
    description: "Hành trình trải nghiệm 3 ngày 2 đêm tại bãi biển dành cho đội ngũ nhân sự nòng cốt. Tập trung vào các hoạt động đội nhóm đặc sắc và đêm lửa trại gắn kết tinh thần đồng đội.",
    stats: [
      { number: "500+", name: "Khách tham dự" },
      { number: "5", name: "Nghệ sĩ" },
      { number: "3 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/experience-1.webp",
    thumbnail: "/home/experience-1.webp",
    link: "/project/teambuilding-techhub"
  },
  {
    id: 3,
    category: "Conference",
    title: "Hội Nghị Thượng Đỉnh Kinh Tế — Tầm Nhìn Chiến Lược 2026",
    description: "Không gian hội thảo chuyên nghiệp với sự góp mặt của các diễn giả hàng đầu. Quy trình đón tiếp chuẩn quốc tế cùng hệ thống âm thanh ánh sáng hiện đại bậc nhất hiện nay.",
    stats: [
      { number: "800+", name: "Khách tham dự" },
      { number: "Cấp cao", name: "Quy mô" },
      { number: "1 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/experience-3.webp",
    thumbnail: "/home/experience-3.webp",
    link: "/project/conference-2026"
  },
  {
    id: 4,
    category: "Year End Party",
    title: "Dạ Tiệc Cuối Năm — Chủ Đề: Ánh Sáng Diệu Kỳ Night Glow",
    description: "Sự kiện tổng kết năm đầy cảm xúc với các tiết mục trình diễn nội bộ và vinh danh cá nhân xuất sắc. Không gian trang trí rực rỡ mang phong cách hiện đại và sang trọng.",
    stats: [
      { number: "1,500+", name: "Khách tham dự" },
      { number: "10", name: "Nghệ sĩ" },
      { number: "1 đêm", name: "Thời gian" }
    ],
    mainImage: "/home/experience-2.webp",
    thumbnail: "/home/experience-2.webp",
    link: "/project/yep-night-glow"
  },
  {
    id: 5,
    category: "Product Launch",
    title: "Ra Mắt Dòng Xe Điện Thế Hệ Mới — Future Drive X1",
    description: "Buổi lễ giới thiệu sản phẩm mới đầy ấn tượng với công nghệ Mapping 3D. Thu hút hàng nghìn khách mời và giới truyền thông tham gia trải nghiệm trực tiếp tính năng sản phẩm.",
    stats: [
      { number: "2,000+", name: "Lượt tiếp cận" },
      { number: "20", name: "Người nổi tiếng" },
      { number: "2 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/experience-4.webp",
    thumbnail: "/home/experience-4.webp",
    link: "/project/launch-x1"
  },
  {
    id: 6,
    category: "Gala Dinner",
    title: "Đêm Tiệc Tri Ân Khách Hàng — Ngân Hàng Thịnh Vượng",
    description: "Sự kiện tri ân dành riêng cho các khách hàng VIP với thực đơn chuẩn Michelin. Không gian âm nhạc cổ điển nhẹ nhàng tạo nên không khí ấm cúng nhưng không kém phần đẳng cấp.",
    stats: [
      { number: "300+", name: "Khách mời VIP" },
      { number: "8", name: "Nghệ sĩ" },
      { number: "1 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/experience-1.webp",
    thumbnail: "/home/experience-1.webp",
    link: "/project/gala-bank"
  },
  {
    id: 7,
    category: "Team Building",
    title: "Trải Nghiệm Sinh Tồn — Hành Trình Về Với Thiên Nhiên",
    description: "Khám phá giới hạn bản thân thông qua chuỗi thử thách vận động và kỹ năng sinh tồn trong rừng sâu. Một dự án mang lại nhiều giá trị tinh thần cho tập thể cán bộ nhân viên.",
    stats: [
      { number: "150+", name: "Nhân viên" },
      { number: "Nature", name: "Địa điểm" },
      { number: "4 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/experience-2.webp",
    thumbnail: "/home/experience-2.webp",
    link: "/project/survival-nature"
  },
  {
    id: 8,
    category: "Grand Opening",
    title: "Khai Trương Trung Tâm Thương Mại — Diamond Plaza",
    description: "Lễ cắt băng khánh thành hoành tráng với sự tham gia của các ngôi sao nổi tiếng. Chuỗi hoạt động giải trí và khuyến mãi kéo dài tạo hiệu ứng bùng nổ cho ngày đầu ra mắt.",
    stats: [
      { number: "3,000+", name: "Lượt khách" },
      { number: "25", name: "Nghệ sĩ" },
      { number: "3 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/experience-4.webp",
    thumbnail: "/home/experience-4.webp",
    link: "/project/opening-diamond"
  },
  {
    id: 9,
    category: "Exhibition",
    title: "Triển Lãm Nghệ Thuật Đương Đại — Những Mảnh Ghép Thời Gian",
    description: "Nơi quy tụ những tác phẩm nghệ thuật độc đáo từ các nghệ sĩ trẻ tài năng. Không gian triển lãm được tối ưu hóa về ánh sáng để làm nổi bật tâm hồn của từng bức tranh trưng bày.",
    stats: [
      { number: "1,200+", name: "Lượt xem" },
      { number: "30", name: "Họa sĩ" },
      { number: "5 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/experience-3.webp",
    thumbnail: "/home/experience-3.webp",
    link: "/project/art-exhibit"
  },
  {
    id: 10,
    category: "Music Festival",
    title: "Đại Nhạc Hội Mùa Hè — Summer Sound Vibe 2026",
    description: "Lễ hội âm nhạc ngoài trời sôi động với dàn line-up cực khủng. Hệ thống sân khấu nước kết hợp hiệu ứng pháo hoa tạo nên một đêm nhạc không thể nào quên cho giới trẻ.",
    stats: [
      { number: "5,000+", name: "Khách hàng tin tưởng" },
      { number: "Top 1", name: "Trending" }
    ],
    mainImage: "/home/hero.webp",
    thumbnail: "/home/hero.webp",
    link: "/project/summer-festival"
  },
  {
    id: 11,
    category: "Workshop",
    title: "Sáng Tạo Nội Dung Số — Kỷ Nguyên Trí Tuệ Nhân Tạo",
    description: "Buổi chia sẻ kiến thức chuyên sâu về ứng dụng công nghệ mới trong sản xuất nội dung. Cơ hội giao lưu trực tiếp với các chuyên gia đầu ngành trong lĩnh vực marketing online.",
    stats: [
      { number: "200+", name: "Học viên" },
      { number: "AI Tech", name: "Chủ đề" },
      { number: "1 ngày", name: "Thời gian" }
    ],
    mainImage: "/home/whychooseus.webp",
    thumbnail: "/home/whychooseus.webp",
    link: "/project/ai-workshop"
  }
];

function CaseStudy({ name, isActive, onClick }: { name: string; isActive: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-[10px] px-4 py-2 transition-all duration-300 ${isActive
          ? "bg-white/20 border-white/50 shadow-[0_0_15px_rgba(142,214,215,0.3)]"
          : "bg-white/5 border-white/10 hover:bg-white/10"
        }`}
    >
      <p className="text-center lg:text-[14px] text-[12px] whitespace-nowrap">{name}</p>
    </div>
  );
}

function LeftContent({
  activeProject,
  activeCategory,
  onCategoryClick
}: {
  activeProject: Project;
  activeCategory: string | null;
  onCategoryClick: (category: string) => void;
}) {
  const categories = ["Gala Dinner", "Team Building", "Conference", "Year End Party"];

  return (
    <div className="flex-1 flex flex-col h-full max-md:justify-center max-md:items-center gap-10">
      <div className="flex flex-col gap-[15px] lg:gap-[25px] max-md:justify-center shrink-0">
        <p className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B7171] max-md:text-center to-[#8ED6D7] text-[14px] md:text-[16px] max-sm:text-center">
          Dự án đã thực hiện
        </p>
        <h1 className="text-[30px] xl:text-[40px] 2xl:text-[59px] bg-clip-text text-transparent bg-gradient-to-r from-[#4B7171] to-[#8ED6D7] font-black leading-tight max-sm:text-center">
          Case Study nổi bật
        </h1>
      </div>
      <div className="md:grid xl:grid-cols-4 md:grid-cols-2 max-md:flex max-md:flex-row gap-[10px] flex-wrap">
        {categories.map((cat) => (
          <CaseStudy
            key={cat}
            name={cat}
            isActive={activeCategory?.toLowerCase() === cat.toLowerCase()}
            onClick={() => onCategoryClick(cat)}
          />
        ))}
      </div>
      <div className="relative h-full w-full rounded-[16px] bg-gradient overflow-hidden">
        <Image
          src={activeProject.mainImage}
          sizes="100vw"
          fill
          className="object-cover transition-opacity duration-500"
          alt={activeProject.title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/1 to-[#121212]" />
      </div>
    </div>
  );
}

function RightContent({ activeProject }: { activeProject: Project }) {
  return (
    <div className="flex-1 flex flex-col gap-10 justify-center max-md:justify-center max-md:items-center">
      <a href="/all-projects" className="justify-end flex cursor-pointer group">
        <p className="text-white/70 group-hover:text-white transition-colors">Xem tất cả dự án</p>
        <ChevronRight2 className="text-white/70 group-hover:text-white transition-colors" />
      </a>
      <div className="flex flex-col gap-10">
        <h1 className="xl:text-[40px] text-[30px] max-md:text-center font-bold">
          {activeProject.title}
        </h1>
        <p className="lg:text-[18px] max-md:text-center text-[12px] text-white/70">
          {activeProject.description}
        </p>
      </div>
      <div className="flex flex-row gap-10 flex-wrap">
        {activeProject.stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] xl:text-[35px] text-[25px] font-black">
              {stat.number}
            </p>
            <p className="text-white/70">{stat.name}</p>
          </div>
        ))}
      </div>
      <a href={activeProject.link} className="inline-block">
        <ButtonGradient name="Xem chi tiết dự án" />
      </a>
    </div>
  );
}

function SliderBottom({
  projects,
  activeProjectId,
  onProjectClick
}: {
  projects: Project[];
  activeProjectId: number;
  onProjectClick: (project: Project) => void;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDragging.current = true;
    dragged.current = false;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 5) dragged.current = true;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="relative md:order-2 order-3 w-full pt-5 select-none">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        className="flex flex-nowrap overflow-x-auto no-scrollbar gap-4 pb-2 cursor-grab active:cursor-grabbing scroll-smooth"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => !dragged.current && onProjectClick(project)}
            className={`group relative flex-none md:w-[13vw] md:h-[8vw] h-[16vw] w-[25vw] rounded-[16px] overflow-hidden transition-all duration-300 border-2 ${activeProjectId === project.id
                ? "border-[#8ED6D7] scale-[1.02] shadow-lg"
                : "border-transparent opacity-60 hover:opacity-100"
              }`}
          >
            <div className="relative w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                draggable={false}
                className="object-cover pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompletedProject() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project>(MOCK_PROJECTS[0]);

  const filteredProjects = useMemo(() => {
    if (!activeCategory) return MOCK_PROJECTS;
    return MOCK_PROJECTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory]);

  const handleCategoryClick = (category: string) => {
    if (activeCategory?.toLowerCase() === category.toLowerCase()) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
      const firstInCat = MOCK_PROJECTS.find(p => p.category.toLowerCase() === category.toLowerCase());
      if (firstInCat) setActiveProject(firstInCat);
    }
  };

  return (
    <section className="md:h-[120vh] h-[140vh] py-[130px] sm:max-h-[900px] lg:max-h-[1000px] xl:max-h-[1300px] max-h-[1300px] py-[60px] lg:py-[100px] flex flex-col overflow-hidden lg:px-[148px] sm:px-[84px] px-[20px]">
      <div className="flex max-md:flex-col h-full xl:gap-[80px] sm:gap-[40px] gap-10">
        <LeftContent
          activeProject={activeProject}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
        <RightContent activeProject={activeProject} />
      </div>
      <SliderBottom
        projects={filteredProjects}
        activeProjectId={activeProject.id}
        onProjectClick={setActiveProject}
      />
    </section>
  );
}