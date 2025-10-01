"use client"

import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/create-meet/navbar";
import { CreateMeetingSchema } from "@/schemas";
import { Calendar28 } from "@/components/create-meet/date-picker";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";


type FormValues = z.infer<typeof CreateMeetingSchema>;

const CreateMeet = () => {

    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(CreateMeetingSchema),
        defaultValues: {
            meetingTitle: "",
            meetingId: "",
            date: "",
            time: "10:30:00",
            enableChat: true,
            recordMeeting: false,
        },
    });

    useEffect(() => {
        if (form.formState.errors.meetingId) {
            const suggestions = Array.from({ length: 3 }, () =>
                "MEET-" + Math.random().toString(36).substring(2, 8).toUpperCase()
            );

            toast.custom((t) => (
                <div className="bg-white shadow-lg rounded-lg p-4 w-64 ">
                    <p className="font-semibold text-red-500 mb-2 font-poppins">
                        Invalid Meeting ID
                    </p>
                    <p className="text-sm text-gray-600 mb-2 font-poppins">
                        Try one of these IDs (click to copy):
                    </p>
                    <div className="flex flex-col gap-2 font-poppins">
                        {suggestions.map((id) => (
                            <button
                                key={id}
                                onClick={() => {
                                    navigator.clipboard.writeText(id);
                                    toast.success(`${id} copied to clipboard ✅`);
                                    toast.dismiss(t.id);
                                }}
                                className="bg-gray-100 font-poppins hover:bg-gray-200 text-sm px-3 py-1 rounded-md text-center"
                            >
                                {id}
                            </button>
                        ))}
                    </div>
                </div>
            ));
        }
    }, [form.formState.errors.meetingId]);

    const handleSubmit = async (values: FormValues) => {
        try {
            const meetingRegex = /^MEET-[A-Z0-9]{6}$/;

            if (!meetingRegex.test(values.meetingId)) {
                const suggestions = Array.from({ length: 3 }, () =>
                    "MEET-" + Math.random().toString(36).substring(2, 8).toUpperCase()
                );

                toast.custom((t) => (
                    <div className="bg-white shadow-lg rounded-lg p-4 w-64 font-poppins">
                        <p className="font-semibold text-red-500 mb-2">
                            Invalid Meeting ID
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            Try one of these IDs:
                        </p>
                        <div className="flex flex-col gap-2 font-poppins">
                            {suggestions.map((id) => (
                                <button
                                    key={id}
                                    onClick={() => {
                                        navigator.clipboard.writeText(id);
                                        toast.success(`${id} copied to clipboard ✅`);
                                        toast.dismiss(t.id);
                                    }}
                                    className="bg-gray-100 font-poppins text-xs hover:bg-gray-200 px-3 py-1 rounded-md text-center"
                                >
                                    {id}
                                </button>
                            ))}
                        </div>

                    </div>
                ));
                return;
            }

            const res = await fetch("/api/meetings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Error creating meeting");
                return;
            }

            toast.success("Meeting created successfully!");
            router.push("join-meet");
        } catch (_err) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex font-poppins items-center justify-center p-6">
                <Card className="w-full max-w-lg rounded-2xl bg-[#0f1724] shadow-2xl border border-slate-800">
                    <CardHeader className="px-8 pt-10 text-center">
                        <CardTitle className="text-3xl font-extrabold text-white">Schedule a Meeting</CardTitle>
                        <p className="text-sm text-slate-400 mt-1">Configure your meeting details below.</p>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="meetingTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Meeting Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Project Sync-up"
                                                    className=" bg-[#0c1d36] border-none text-slate-200 rounded-lg h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="meetingId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Create Metting ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="5%HA*ey"
                                                    className=" bg-[#0c1d36] border-none text-slate-200 rounded-lg h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-300">Date</FormLabel>
                                                <FormControl>
                                                    <Calendar28 value={field.value} onChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-300">Time</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type="time"
                                                            id="time-picker"
                                                            step="1"
                                                            {...field}
                                                            placeholder="10:30:00"
                                                            className="bg-[#0c1d36] text-slate-200 border-none rounded-lg h-12 px-3
                                                            appearance-none 
                                                            [&::-webkit-calendar-picker-indicator]:opacity-100
                                                            [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                                            [&::-webkit-calendar-picker-indicator]:invert
                                                            [&::-webkit-calendar-picker-indicator]:mr-2"
                                                        />

                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Separator className="bg-slate-700" />
                                <FormField
                                    control={form.control}
                                    name="enableChat"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <div className="text-slate-200 text-sm font-medium">Enable Chat</div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="recordMeeting"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <div className="text-slate-200 text-sm font-medium">Record Meeting</div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <Button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 font-poppins text-white px-4 py-2 rounded-md text-sm font-medium transition"
                                    >
                                        Create a Meeting
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>

                </Card>
            </div>
        </>
    );
}

export default CreateMeet;
