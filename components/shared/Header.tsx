import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full border-b header-container fixed inset-x-0 top-0 z-50 flex justify-center">
      <div className="mx-auto flex h-[75px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/assets/images/logo.png"
            width={70}
            height={70}
            alt="Events logo"
            className="h-12 w-12 sm:h-16 sm:w-16"
          />
          <h2 className="logo-name text-2xl leading-tight sm:text-3xl">Events</h2>
        </Link>
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <SignedIn>
            <nav className="hidden md:block">
              <NavItems />
            </nav>
          </SignedIn>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <MobileNav />
            </SignedIn>
            <SignedOut>
              <Button asChild className="rounded-full px-5 text-sm sm:px-8 sm:text-base" size="lg">
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
