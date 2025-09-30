import z from "zod";

export const CreateMeetingSchema = z.object({
  meetingTitle: z
    .string()
    .trim()
    .min(2, { message: "Please enter the meeting title" })
    .max(100, { message: "Meeting title should not exceed 100 characters" }),

  password: z.string().trim().optional(),

  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),

  enableChat: z.boolean(),
  recordMeeting: z.boolean(),
});

export type CreateMeetingSchemaType = z.infer<typeof CreateMeetingSchema>;
