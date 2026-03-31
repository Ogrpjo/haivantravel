import ContactForm from "./ContactForm";
import GoogleMap from "./GoogleMap";
import Location from "./Location";

export default function ContactBody() {
  return (
    <section className="min-h-[100vh] overflow-x-hidden pb-[10vh] pt-[150px] max-sm:px-[12px] sm:px-[10vw] xl:px-[15vw] flex flex-col gap-10">
      <div className="">
        <h1 className="text-[30px] font-bold max-sm:text-center">LIÊN HỆ</h1>
        <div className="max-w-[3%] border-b max-sm:hidden" />
      </div>
      <Location />
    <div className="flex w-full gap-10 items-stretch max-sm:flex-col">
        <div className="flex-1">
          <ContactForm />
        </div>
        <div className="flex-1">
          <GoogleMap />
        </div>
    </div>
    </section>
  );
}
