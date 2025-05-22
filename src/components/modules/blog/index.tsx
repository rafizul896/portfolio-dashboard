"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { NMTable } from "@/components/core";
import DeleteConfirmationModal from "@/components/core/DeleteConfirmationModal";
import { TBlog } from "@/types/blog.type";
import AddSkillModal from "./AddBlog";
import { deleteBlog } from "@/services/blog";
import UpdateBlogModal from "./UpdateBlog";

const ManageBlogs = ({ blogs }: { blogs: TBlog[] }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleDelete = (data: TBlog) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.title);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedId) {
        const res = await deleteBlog(selectedId);
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

  const columns: ColumnDef<TBlog>[] = [
    {
      accessorKey: "name",
      header: "Skill Name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Image
            src={
              row.original.thumbnail ||
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span>{row.original.category}</span>,
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <span>{row.original.author}</span>,
    },

    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <UpdateBlogModal blog={row.original} />

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
        <h1 className="text-xl font-bold">Manage Blogs</h1>
        <div className="flex items-center gap-2">
          <AddSkillModal />{" "}
        </div>
      </div>
      <NMTable columns={columns} data={blogs || []} />

      <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageBlogs;
