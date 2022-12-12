import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getBooking } from "~/models/booking.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.bookingId, "bookingId not found");

  const booking = await getBooking(params.bookingId);

  if (!booking) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ booking });
}

export default function BookingDetailPage() {
  const { booking } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="mb-2 text-xl">BookingId: {booking.id}</div>
      <div className="mb-2 text-xl">
        TransactionId: {booking.transaction_id}
      </div>
      <div className="mb-2 text-xl">
        Batch: {`${booking.batch.start_time} - ${booking.batch.end_time}`}
      </div>
      <div className="mb-2 text-xl">
        Month:
        {new Date(booking.created_at).toLocaleString("default", {
          month: "long",
        })}
      </div>
    </>
  );
}
