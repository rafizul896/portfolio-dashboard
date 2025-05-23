"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { NMTable } from "@/components/core";
import DeleteConfirmationModal from "@/components/core/DeleteConfirmationModal";
import { TExperience } from "@/types/experience.type";
import { deleteExperience } from "@/services/experience";
import AddExperienceModal from "./AddExperience";
import UpdateExperienceModal from "./UpdateExperience";

const ManageExperience = ({ experiences }: { experiences: TExperience[] }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleDelete = (data: TExperience) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.title);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedId) {
        const res = await deleteExperience(selectedId);
        if (res?.success) {
          toast.success(res?.message);
          setModalOpen(false);
        } else {
          toast.error(res?.message);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnDef<TExperience>[] = [
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Image
            src={
              row.original.companyLogo ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4EBD8ObUxTnbJn_zC9CS-BbgNXkn56UvhMR9HbC-ExmbZXoLIuJy0kQQbJcjvIiKEtHs&usqp=CAU"
            }
            alt={row.original.title}
            width={40}
            height={40}
            className="w-8 h-8 rounded-full"
          />
          <span className="truncate">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => <span>{row.original.company}</span>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span>{row.original.location}</span>,
    },

    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <UpdateExperienceModal experience={row.original} />

          <button
            className="text-gray-500 cursor-pointer hover:text-red-500"
            title="Delete"
            onClick={() => handleDelete(row.original)}
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Experience</h1>
        <div className="flex items-center gap-2">
          <AddExperienceModal />
        </div>
      </div>
      <NMTable columns={columns} data={experiences || []} />

      <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageExperience;
