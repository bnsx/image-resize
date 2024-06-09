"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { toast } from "sonner";

export default function Donation() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant={"outline"} className="w-fit">
          บริจาคค่าข้าว
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-fit xl:w-fit">
        <DialogHeader>
          <DialogTitle>QR Prompt Pay</DialogTitle>
          <DialogDescription className="text-ellipsis">
            รองรับทุกธนาคารและ E-Wallet (รวมถึง True Wallet)
          </DialogDescription>
        </DialogHeader>
        <div className="w-fit">
          <Image src={"/qr-prompt-pay.png"} width={400} height={400} alt="" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => toast.success("ขอบพระคุณครับ 🙏")}
            >
              กินข้าวให้อร่อยนะ
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
