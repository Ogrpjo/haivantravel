import LocationDetail from "./LocationDetail";

export default function Location() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row max-sm:flex-col max-sm:gap-10 sm:justify-between sm:items-center">
        <LocationDetail />
      </div>
      <div className="border-b" />
      <p className="max-sm:text-[14px] max-sm:text-center">Mọi thông tin liên hệ vui lòng điền vào form liên hệ!</p>
    </div>
  );
}
