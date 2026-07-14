import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST() {
  const roomId = nanoid(6).toLowerCase();
  return NextResponse.json({ roomId });
}
