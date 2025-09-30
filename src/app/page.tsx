import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/home/hero";
import { Why } from "@/components/home/why";
import { Testimonials } from "@/components/home/testimonials";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Why />
      <Testimonials />
      <Footer />
    </>
  );
}
