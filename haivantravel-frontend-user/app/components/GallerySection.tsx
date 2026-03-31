import InfinityGallery from "./InfinityGallery";

export default function GallerySection() {
  return (
    <section className="flex flex-col items-center justify-center border-t border-[#1D1C1C] min-h-screen max-sm:min-h-[800px] overflow-hidden relative border-b-1 border-[#1D1C1C]">
      <h3 className="2xl:text-[65px] pt-[10vh] xl:text-[60px] lg:text-[50px] md:text-[40px] sm:text-[30px] text-[40px] max-sm:text-[20px] font-black text-transparent translate-y-[0px] bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] relative z-70">
        Hình ảnh về chúng tôi
      </h3>
      <InfinityGallery />
      <div className="absolute w-[2000px] h-[700px] bg-[#121212] [border-radius:50%/30%] left-1/2 -translate-x-1/2 mt-[20px] z-50 sm:top-[-420px] md:top-[-400px] top-[-520px] " />
      <div className="absolute w-[3000px] h-[1500px] bg-[#121212] [border-radius:50%/30%] left-1/2 -translate-x-1/2 z-20 mb-[-800px] bottom-[-410px] " />
    </section>
  );
}
