import z from "zod";

export const CreateMeetingSchema = z.object({
  meetingTitle: z
    .string()
    .trim()
    .min(2, { message: "Please enter the meeting title" })
    .max(100, { message: "Meeting title should not exceed 100 characters" }),

  meetingId: z
    .string()
    .min(8, "Meeting ID must be at least 8 characters")
    .regex(/^MEET-[A-Z0-9]{6}$/, "Meeting ID must be in the format MEET-XXXXXX"),

  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),

  enableChat: z.boolean(),
  recordMeeting: z.boolean(),
});


export const JoinMeetingSchema = z.object({
  meetingId: z
    .string()
    .min(6, "Meeting ID too short")
    .max(12, "Meeting ID too long")
    .regex(/^MEET-[A-Z0-9]{6}$/, "Meeting ID must be in the format MEET-XXXXXX"),
});
