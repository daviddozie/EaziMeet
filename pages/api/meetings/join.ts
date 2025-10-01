import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { meetingId } = req.body;

  if (!meetingId) return res.status(400).json({ error: "Meeting ID is required." });

  const meetingRef = doc(db, "meetings", meetingId);
  const docSnap = await getDoc(meetingRef);

  if (!docSnap.exists()) {
    return res.status(404).json({ error: "Meeting ID not found. Please check or try another ID." });
  }

  res.status(200).json({ success: true, meeting: docSnap.data() });
}
