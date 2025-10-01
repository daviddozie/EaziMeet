'use client'

import Slider from "react-slick";
import { testimonials } from "@/data/testimonials"
import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

export const Testimonials = () => {
    const sliderRef = useRef<Slider | null>(null);

    const settings = {
        dots: true, 
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="font-poppins py-20 w-[90%] mx-auto">
            <div>
                <h1 className="text-white font-bold md:text-4xl text-2xl text-center mb-4">
                    What Our Users Say
                </h1>
                <p className="text-[#9CA3AF] text-center">
                    Real stories from our amazing community.
                </p>
            </div>
            <section className="text-white py-10 font-poppins">
                <div className="app-width">
                    <Slider ref={sliderRef} {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="md:pr-6 h-full">
                                <div className="flex flex-col justify-between h-full px-6 py-8 rounded-lg bg-[#111827] shadow-md">
                                    <p className="text-[#D1D5DB] text-sm mb-6 leading-[28px] flex-grow">
                                        “{testimonial.feedback}”
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Image src={`/user-avatar.png`} alt="user" width={48} height={48} />
                                        <div>
                                            <p className="text-white font-semibold">{testimonial.name}</p>
                                            <p className="text-[#9CA3AF] text-xs">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </Slider>
                </div>
            </section>
        </div>
    )
}
