import { Outlet } from "@remix-run/react";

export default function SongRequests() {
    return <>
        <h2>Song Requests</h2>
        <Outlet />
    </>
}