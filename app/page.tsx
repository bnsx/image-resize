import { type Metadata } from "next";
import MainForm from "./main-form";
import UploadedList from "../components/UploadedList";

export const metadata: Metadata = {
  title: "บริการลดขนาดไฟล์ภาพฟรี (づ ᴗ _ᴗ)づ♡",
  description:
    "บริการลดขนาดไฟล์ภาพฟรี สะดวก รวดเร็ว ปลอดภัย, Free Image Size Reducer",
};

export default function Home() {
  return <MainForm />;
}
