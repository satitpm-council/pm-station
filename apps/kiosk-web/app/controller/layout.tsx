import "react-toastify/dist/ReactToastify.min.css";
import Providers from "./providers";

export default function ControllerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
