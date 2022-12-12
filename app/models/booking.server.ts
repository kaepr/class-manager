import type { User, Transaction, Batch, Booking } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createBooking({
  batchId,
  userId,
}: { userId: User["id"] } & { batchId: Batch["id"] }) {
  // Create booking and payment in one transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Create corresponding transaction
    const txn = await tx.transaction.create({
      data: {
        user_id: userId,
      },
    });

    // 2. Create booking for this month
    const booking = await tx.booking.create({
      data: {
        user_id: userId,
        batch_id: batchId,
        transaction_id: txn.id,
      },
    });

    return booking;
  });
}

export function getBatches() {
  return prisma.batch.findMany();
}

export async function isMonthBooked() {
  const booking = await prisma.booking.findFirst({
    orderBy: [
      {
        created_at: "desc",
      },
    ],
  });

  if (!booking) {
    return false;
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const bookingMonth = booking.created_at.getMonth();
  const bookingYear = booking.created_at.getFullYear();

  return currentMonth === bookingMonth && currentYear === bookingYear;
}

export function getBookings(userId: string) {
  return prisma.booking.findMany({
    where: {
      user_id: userId,
    },
  });
}
