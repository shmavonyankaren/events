import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t w-full flex justify-center">
      <div className="w-[100%] p-[1.25rem] max-w-[80rem] pb-[0.2rem] pt-[0.2rem] flex items-center justify-between flex-col text-center  sm:flex-row">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            width={70}
            height={70}
            alt="Events logo"
          />
          <h2 className="h2-bold text-center">Events</h2>
        </Link>

        <p>2024 Events. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
