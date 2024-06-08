import { type Metadata } from "next";
import MainForm from "./main-form";
import UploadedList from "./uploaded-list";

export const metadata: Metadata = {
  title: "บริการลดขนาดไฟล์ภาพฟรี (づ ᴗ _ᴗ)づ♡",
  description:
    "บริการลดขนาดไฟล์ภาพฟรี สะดวก รวดเร็ว ปลอดภัย, Free Image Size Reducer",
};

export default function Home() {
  return (
    <div className="translate-y-32 xl:px-0 px-2 grid xl:justify-center gap-1">
      <MainForm />
      <UploadedList />
    </div>
  );
}
