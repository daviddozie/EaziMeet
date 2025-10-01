"use client";

import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/create-meet/navbar";
import { JoinMeetingSchema } from "@/schemas";
import { toast } from "sonner";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

type FormValues = z.infer<typeof JoinMeetingSchema>;

const JoinMeet = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const meetingId: string = searchParams?.get("meetingId") ?? "";


    const form = useForm<FormValues>({
        resolver: zodResolver(JoinMeetingSchema),
        defaultValues: {
            meetingId,
        },
    });

    const handleSubmit = async (values: FormValues) => {
        try {
            const res = await fetch("/api/meetings/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) return toast.error(data.error);

            toast.success("You now have access to the meeting!");
            router.push("/room");
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex font-poppins items-center justify-center px-6 pt-10">
                <Card className="w-full max-w-lg rounded-2xl bg-[#0f1724] shadow-2xl border border-slate-800">
                    <CardHeader className="px-8 pt-10 text-center">
                        <CardTitle className="text-3xl font-extrabold text-white">
                            Join a Meeting
                        </CardTitle>
                        <p className="text-sm text-slate-400 mt-1">
                            Enter the meeting ID to join an existing meeting
                        </p>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="meetingId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">
                                                Meeting ID
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Meeting ID"
                                                    className="bg-[#0c1d36] border-none text-slate-200 rounded-lg h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <Button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 font-poppins text-white px-4 py-2 rounded-md text-sm font-medium transition"
                                    >
                                        Join Meeting
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default JoinMeet;
