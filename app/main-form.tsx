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
import { FileState, FileStatus } from "@/@types/file";
import { ReducerMany, ReducerReturnProps } from "@/lib/reducer";
import { computeSize } from "@/lib/size";
import { toast } from "sonner";
import UploadedList from "@/components/UploadedList";

const schema = z.object({
  unit: z.enum(["kb", "mb"]),
  minSize: z.coerce
    .number()
    .int()
    .positive({ message: "โปรดป้อนตัวเลขที่มีค่ามากกว่า 0" }),
  maxSize: z.coerce
    .number()
    .int()
    .positive({ message: "โปรดป้อนตัวเลขที่มีค่ามากกว่า 0" }),
});

const unit_data = [
  { label: "KB", value: "kb" },
  { label: "MB", value: "mb" },
];

export default function MainForm() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { maxSize: 600, unit: "kb" },
  });

  const compressedToDoUpdate = (
    file: FileState,
    reduced: ReducerReturnProps[]
  ): FileState => {
    const compressedFile = reduced.find(
      (z) => z.blobURL === file.blobURL && z.status === "done"
    );
    if (compressedFile) {
      return {
        ...file,
        newFile: compressedFile.newFile,
        newBlobURL: URL.createObjectURL(compressedFile.newFile as File),
        savedPercent: compressedFile.savedPercent,
        status: compressedFile.status,
      };
    }
    return { ...file, status: "incomplete" as FileStatus, savedPercent: 0 };
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
    try {
      setSubmit(true);
      const maxSize = computeSize(value.unit, value.maxSize);
      const reduced = await ReducerMany(
        files.filter((x) => x.status !== "done"),
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
    <div className="translate-y-32 xl:px-0 px-2 grid xl:justify-center gap-1">
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
      <UploadedList files={files} removeFile={removeFile} />
    </div>
  );
}
