"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAppointment } from "@/lib/dal";
import { Button } from "./ui/button";
// Import the AlertDialog components from your shadcn UI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface DeleteButtonProps {
  id: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id }) => {
  const router = useRouter();
  // State to control whether the dialog is open
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAppointment(id);
      // Refresh the page or revalidate your data after deletion
      router.refresh();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger button for opening the dialog */}
      <AlertDialogTrigger asChild>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </AlertDialogTrigger>
      {/* Dialog content */}
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the appointment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDelete();
              // Optionally close the dialog after deletion
              setOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
