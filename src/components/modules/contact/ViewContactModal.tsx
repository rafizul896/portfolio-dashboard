"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { TContact } from "@/types/contact.type";
import { format } from "date-fns";

export default function ViewcontactModal({ contact }: { contact: TContact }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-gray-500 cursor-pointer hover:text-cyan-400"
          title="View Details"
        >
          <Eye className="w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>contact Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-semibold text-sm text-muted-foreground">Name</p>
            <p className="text-base">{contact?.name}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-muted-foreground">Email</p>
            <p className="text-base">{contact?.email}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-muted-foreground">
              Subject
            </p>
            <p className="text-base">{contact?.subject}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-muted-foreground">
              Message
            </p>
            <p className="text-base whitespace-pre-line">{contact?.message}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-muted-foreground">
              Submitted At
            </p>
            <p className="text-base">
              {contact?.createdAt &&
                format(new Date(contact?.createdAt), "PPpp")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
