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
import { MyDropzone } from "./dropzone";
import { useAtom } from "jotai";
import { FileAtomDataType, FileAtomStatus, filesAtom } from "@/states/file";
import { ReducerMany, ReducerReturnProps } from "@/lib/reducer";
import { computeSize } from "@/lib/size";
import { toast } from "sonner";

const schema = z.object({
  unit: z.enum(["kb", "mb"]),
  maxSize: z.coerce
    .number()
    .int()
    .positive({ message: "โปรดป้อนตัวเลขที่มีค่ามากกว่า 0" }),
  // output: z.enum(["image/jpeg", "image/png"]),
});

const unit_data = [
  { label: "KB", value: "kb" },
  { label: "MB", value: "mb" },
];
// const output_data = [
//   { label: ".jpg", value: "image/jpeg" },
//   { label: ".png", value: "image/png" },
// ];

export default function MainForm() {
  const [files, setFiles] = useAtom(filesAtom);
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { maxSize: 600, unit: "kb" },
  });

  const compresseUpdate = (
    file: FileAtomDataType,
    reduced: ReducerReturnProps[]
  ): FileAtomDataType => {
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
    return { ...file, status: "incomplete" as FileAtomStatus, savedPercent: 0 };
  };
  const compressingPercent = (blobURL: string, progress: number) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.blobURL === blobURL
          ? { ...file, progress, status: "inprogress" } // Update compressingPercent for the matching blobURL
          : file
      )
    );
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
        compressingPercent
      );
      const updatedFiles = files.map((file) => {
        if (file.status === "done") {
          return file; // Keep done files unchanged
        }
        return compresseUpdate(file, reduced);
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
            <MyDropzone />
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
            {/* <FormSelect
              control={form.control}
              schema={schema}
              name={"output"}
              data={output_data}
              label="ฟอร์แมตที่ต้องการ (Format)"
            /> */}
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
  );
}
