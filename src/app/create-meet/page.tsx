"use client"

import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/create-meet/navbar";
import { CreateMeetingSchema } from "@/schemas";

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

    const form = useForm<FormValues>({
        resolver: zodResolver(CreateMeetingSchema),
        defaultValues: {
            meetingTitle: "",
            password: "",
            date: "",
            time: "",
            enableChat: true,
            recordMeeting: false,
        },
    });


    const handleSubmit = async (values: FormValues) => {
        console.log("Meeting payload:", values);
        alert("Meeting created — check console for payload (demo)");
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex font-poppins items-center justify-center bg-[#061022] p-6">
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
                                                    className="mt-2 bg-[#0c1d36] border-none text-slate-200 rounded-lg h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Optional Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="mt-2 bg-[#0c1d36] border-none text-slate-200 rounded-lg h-12"
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
                                                <div className="relative mt-2">
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            className="bg-[#0c1d36] border-none text-slate-200 rounded-lg h-12 pr-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Calendar className="absolute right-3 top-3 text-slate-400" size={16} />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-300">Time</FormLabel>
                                                <div className="relative mt-2">
                                                    <FormControl>
                                                        <Input
                                                            type="time"
                                                            className="bg-[#0c1d36] border-none text-slate-200 rounded-lg h-12 pr-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Clock className="absolute right-3 top-3 text-slate-400" size={16} />
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
            </div></>
    );
}

export default CreateMeet;
