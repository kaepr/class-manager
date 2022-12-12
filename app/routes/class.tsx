import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { useUser } from "~/utils";

import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getBookings } from "~/models/booking.server";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const bookings = await getBookings(userId);
  return json({ bookings });
}

export default function ClassPage() {
  const user = useUser();
  const { bookings } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      {" "}
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Classes</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <main className="flex h-full">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="book" className="block p-4 text-xl text-blue-500">
            + New Booking
          </Link>

          <hr />

          {bookings.length === 0 ? (
            <p className="p-4">No bookings made yet</p>
          ) : (
            <ol>
              {bookings.map((booking) => {
                return (
                  <li key={booking.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block border-b p-4 text-xl ${
                          isActive ? "bg-white" : ""
                        }`
                      }
                      to={booking.id}
                    >
                      {new Date(booking.created_at).toLocaleString("default", {
                        month: "long",
                      })}
                    </NavLink>
                  </li>
                );
              })}
            </ol>
          )}

          {/* list previous bookings */}
          {bookings.map((booking) => {})}
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
