"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { useState } from "react";
import { MyDropzone } from "../components/Dropzone";
import { FileState } from "@/@types/file";
import { ReducerMany, ReturnProps } from "@/lib/reducer";
import { toByte } from "@/lib/size";
import { toast } from "sonner";
import UploadedList from "@/components/UploadedList";
import Donation from "@/components/Donation";

const schema = z.object({
  unit: z.enum(["kb", "mb"]),
  type: z.enum(["reduce", "boost"]),
  maxSize: z.coerce
    .number()
    .int()
    .positive({ message: "โปรดป้อนตัวเลขที่มีค่ามากกว่า 0" }),
});

const unit_data = [
  { label: "KB", value: "kb" },
  { label: "MB", value: "mb" },
];
const type_data = [
  { label: "ลดขนาดไฟล์", value: "reduce" },
  { label: "เพิ่มขนาดไฟล์", value: "boost" },
];
export default function MainForm() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { unit: "kb", type: "reduce", maxSize: 600 },
  });

  const compressedToDoUpdate = (
    file: FileState,
    reduced: ReturnProps[]
  ): FileState => {
    const compressedFile = reduced.filter((z) => z.blobURL === file.blobURL)[0];
    if (compressedFile.status === "done") {
      return {
        ...file,
        newFile: compressedFile.newFile,
        newBlobURL: URL.createObjectURL(compressedFile.newFile as File),
        savedPercent: compressedFile.savedPercent,
        status: compressedFile.status,
      };
    }
    return {
      ...file,
      savedPercent: compressedFile.savedPercent,
      status: compressedFile.status,
    };
  };
  const setCompressingPercent = (blobURL: string, progress: number) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.blobURL === blobURL
          ? { ...file, progress, status: "inprogress" } // Update compressingPercent for the matching blobURL
          : file
      )
    );
  };
  const removeFile = (blobURL: string) => {
    setFiles(files.filter((x) => x.blobURL !== blobURL));
  };
  const onSubmit = async (value: z.output<typeof schema>) => {
    if (files.length === 0) {
      return toast.error("โปรดอัพโหลดภาพ");
    }
    if (files.every((x) => x.status === "done")) {
      return;
    }
    try {
      setSubmit(true);
      const maxSize = toByte(value.unit, value.maxSize);
      const reduced = await ReducerMany(
        files.filter((x) => x.status !== "done"),
        value.type,
        maxSize,
        setCompressingPercent
      );
      const updatedFiles = files.map((file) => {
        if (file.status === "done") {
          return file; // Keep done files unchanged
        }
        return compressedToDoUpdate(file, reduced);
      });
      setFiles(updatedFiles);
    } finally {
      setSubmit(false);
    }
  };
  const onReset = () => {
    setFiles([]);
    form.reset();
    setSubmit(false);
  };
  return (
    <div className="xl:translate-y-32 grid xl:justify-center gap-1">
      <Donation />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset}>
          <Card className="xl:w-96">
            <CardHeader>
              <CardTitle>บริการลดขนาดไฟล์ภาพฟรี</CardTitle>
              <CardDescription>
                รองรับเฉพาะไฟล์นามสกุล .jpg และ .png
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <MyDropzone setFiles={setFiles} />
              <div className="flex items-end gap-1">
                <FormInput
                  control={form.control}
                  schema={schema}
                  name={"maxSize"}
                  label="ขนาดไฟล์สูงสุด (Max Size)"
                  placeholder="ป้อนขนาดไฟล์ที่ต้องการไม่ให้เกิน"
                  className="w-full"
                />
                <FormSelect
                  control={form.control}
                  schema={schema}
                  name={"unit"}
                  data={unit_data}
                />
              </div>
              <FormSelect
                control={form.control}
                schema={schema}
                name={"type"}
                data={type_data}
                label="เพิ่ม / ลด"
              />
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-end gap-1">
                <Button type="reset" variant={"outline"} disabled={isSubmit}>
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={isSubmit || files.length === 0}>
                  ดำเนินการ
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <UploadedList files={files} removeFile={removeFile} isSubmit={isSubmit} />
    </div>
  );
}
