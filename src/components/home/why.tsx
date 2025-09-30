import Image from "next/image"

export const Why = () => {

    const benefits = [
        {
            icon: "/lighten.svg",
            operation: "Instant Meetings",
            description: "Host meetings of any size."
        },
        {
            icon: "/participant.svg",
            operation: "Unlimited Participants",
            description: "Host meetings of any size."
        },
        {
            icon: "/time.svg",
            operation: "No Time Limits",
            description: "Enjoy uninterrupted sessions."
        },
        {
            icon: "/secure.svg",
            operation: "Secure & Private",
            description: "End-to-end encryption for all meetings."
        },
    ];

    return (
        <div className="md:py-20 py-10 font-poppins bg-[#111827]">
            <div className="w-[90%] mx-auto">
                <h1 className="text-white font-bold md:text-4xl text-2xl text-center mb-4">Why Choose EaziMeet?</h1>
                <p className="text-[#9CA3AF] text-center">Experience the simplicity and efficiency of EaziMeet, designed for seamless real-time collaboration.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                    {benefits.map((benefit, index) => (
                        <div className="font-poppins" key={index}>
                            <div className="bg-[#E0F2FE] w-16 h-16 rounded-full flex justify-center mx-auto items-center mb-6">
                                <Image src={benefit.icon} alt={`${benefit.icon}-icon`} width={34} height={34} />
                            </div>
                            <h5 className="text-white font-semibold text-center">{benefit.operation}</h5>
                            <p className="text-[#9CA3AF] text-[14px] text-center">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}