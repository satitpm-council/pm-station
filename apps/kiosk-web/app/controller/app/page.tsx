import {   redirect } from "next/navigation";

export default async function ControllerAppRootPage() {
  redirect("/controller/app/songrequests")
  return null;
}
