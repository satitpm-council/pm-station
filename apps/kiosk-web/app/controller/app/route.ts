import { NextRequest, NextResponse } from "next/server";

export const GET = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = "/controller/app/queue";
  return NextResponse.redirect(url);
};
