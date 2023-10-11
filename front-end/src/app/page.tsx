import Image from "next/image";
import HeroSection from "@/components/LandingPage/HeroSection";
import Nav from "@/components/LandingPage/Nav";
export default function Home() {
  return (
    <>
      {/* <nav>
        <Nav />
      </nav> */}
      <section className="mt-8">
        <HeroSection />
      </section>
    </>
  );
}
