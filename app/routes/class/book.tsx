import { ActionArgs, LoaderArgs, redirect, json } from "@remix-run/node";
import {
  createBooking,
  getBatches,
  isMonthBooked,
} from "~/models/booking.server";

import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getUser, requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const isBooked = await isMonthBooked(userId);

  const user = await getUser(request);

  if (!user) {
    return redirect("/");
  }

  if (user.age < 18 || user.age > 65) {
    return json(
      {
        errors: {
          age: "Need to be between 18 and 65 to register",
          batch_id: "",
        },
      },
      { status: 400 }
    );
  }

  if (isBooked) {
    throw new Error("You have already booked for this month");
  }

  const formData = await request.formData();
  const batchId = formData.get("batch_id");

  if (typeof batchId !== "string" || batchId.length === 0) {
    return json(
      {
        errors: {
          batch_id: "Batch is required",
          age: "",
        },
      },
      { status: 400 }
    );
  }

  await createBooking({ userId, batchId });
  return redirect(`/class`);
}

export async function loader({ request }: LoaderArgs) {
  const batches = await getBatches();
  return json({ batches });
}

export default function CreateBookingPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      Create a new booking for this month
      <Form method="post">
        {data.batches.map((batch) => {
          return (
            <div className="m-2 flex" key={batch.id}>
              <input
                className="m-0"
                type="radio"
                id={batch.id}
                name="batch_id"
                value={batch.id}
              />
              <label
                className="ml-2 inline align-top"
                htmlFor={batch.id}
              >{`${batch.start_time} - ${batch.end_time}`}</label>
            </div>
          );
        })}

        {actionData?.errors?.batch_id && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.batch_id}
          </div>
        )}

        {actionData?.errors?.age && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.age}
          </div>
        )}

        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Create Booking
        </button>
      </Form>
    </div>
  );
}
