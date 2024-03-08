import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full border-b header-container fixed z-50 flex justify-center">
      <div className="w-[100%] p-[1.25rem] max-w-[80rem] pb-[0.2rem] pt-[0.2rem] flex items-center justify-between">
        <Link href="/" className="w-36 flex items-center">
          <Image
            src="/assets/images/logo.png"
            width={70}
            height={70}
            alt="Events logo"
          />
          <h2 className="h2-bold text-center logo-name">Events</h2>
        </Link>
        <div className="flex">
          <SignedIn>
            <nav className="md:flex-between hidden w-full max-w-xs">
              <NavItems />
            </nav>
          </SignedIn>

          <div className="flex w-32 justify-end gap-3">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <MobileNav />
            </SignedIn>
            <SignedOut>
              <Button asChild className="rounded-full" size="lg">
                <Link href="/sign-in">Login</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
