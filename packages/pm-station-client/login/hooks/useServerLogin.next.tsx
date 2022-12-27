import { useSearchParams } from "next/navigation";

import type { User } from "firebase/auth";
import type { LoginAction } from "@station/shared/api";
import { toast } from "react-toastify";
import axios from "axios";

export const useServerLogin = () => {
  const searchParams = useSearchParams();
  const serverLogin = async (user: User) => {
    // grab the id token and pass it to the backend
    const token = await user.getIdToken();
    try {
      await axios.post<LoginAction>("/api/login", {
        token,
        continueUrl: searchParams.get("continueUrl"),
      });
    } catch (err) {
      console.error(err);
      toast(
        <>
          <b>ไม่สามารถเข้าสู่ระบบได้</b>
          <span>ข้อผิดพลาดจากเซิร์ฟเวอร์</span>
        </>,
        {}
      );
    }
  };

  return serverLogin;
};
