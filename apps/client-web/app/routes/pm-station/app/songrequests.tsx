import { Form, Outlet } from "@remix-run/react";

export default function SongRequests() {
  return (
    <>
      <h2 className="text-lg font-bold">Song Requests</h2>
      <Form
        action="/pm-station/app/songrequests/search"
        className="flex flex-row gap-4 items-center justify-center"
      >
        <input
          name="q"
          type="text"
          className="rounded border px-4 py-2"
          placeholder="Search for a song"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </Form>
      <Outlet />
    </>
  );
}
