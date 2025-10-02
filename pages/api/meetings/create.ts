import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { meetingId, title, date, time, enableChat, recordMeeting } = req.body;

  if (!meetingId) return res.status(400).json({ error: "Meeting ID is required." });

  const meetingRef = doc(db, "meetings", meetingId);
  const docSnap = await getDoc(meetingRef);

  if (docSnap.exists()) {
    return res.status(400).json({ error: "Meeting ID already exists." });
  }

  await setDoc(meetingRef, {
    title: title ?? "",
    date: date ?? null,
    time: time ?? null,
    enableChat: enableChat ?? false,
    recordMeeting: recordMeeting ?? false,
  });

  res.status(200).json({ success: true });
}
