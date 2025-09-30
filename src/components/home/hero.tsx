'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export const Hero = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col md:flex-row items-center gap-20 justify-between w-[90%] mx-auto py-10 lg:pb-20">
            <div className="lg:max-w-[540px] mb-15">
                <h1 className="text-white text-center md:text-start font-poppins font-black text-3xl md:text-4xl lg:text-5xl">Connect Instantly, <br /> Meet Seamlessly</h1>
                <p className="text-[#D1D5DB] text-center md:text-start font-poppins mt-4 mb-6 leading-[28px]">EaziMeet offers a streamlined platform for spontaneous meetings and collaborative sessions. Start or join a meeting with a single click, no downloads or sign-ups required.</p>
                <div className="flex justify-center md:justify-start">
                    <Button
                        onClick={() => router.push("/create")}
                        className="bg-orange-500 w-full md:w-[180px] hover:bg-orange-600 font-poppins text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                        Create a Meeting
                    </Button>
                </div>
            </div>
            <div className="w-full">
                <Image
                    src={`/hero.png`}
                    alt="hero-img"
                    width={512}
                    height={341.44}
                    className="w-full h-full"
                />
            </div>
        </div>
    )
}