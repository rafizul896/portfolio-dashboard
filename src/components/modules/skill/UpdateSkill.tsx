"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import NMImageUploader from "@/components/core/ImageUploader";
import ImagePreviewer from "@/components/core/ImageUploader/ImagePreviewer";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { TSkill } from "@/types/skill.type";
import { updateSkill } from "@/services/skill";

// Props: selectedSkill will come from parent component
export default function UpdateSkillModal({
  selectedSkill,
}: {
  selectedSkill: TSkill;
}) {
  const [open, setOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      icon: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  // Set default values from selectedSkill

  useEffect(() => {
    if (selectedSkill) {
      reset({
        name: selectedSkill.name,
        category: selectedSkill.category,
        icon: selectedSkill.icon,
      });

      // Set initial preview from selectedSkill.icon
      if (selectedSkill.icon) {
        setImagePreview([selectedSkill.icon]);
      }
    }
  }, [selectedSkill, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    for (const file of imageFiles) {
      formData.append("file", file);
    }

    try {
        const res = await updateSkill(selectedSkill._id, formData); // Pass ID and formData

        toast.success(res.message || "Skill updated successfully");
      setOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err?.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-gray-500 cursor-pointer hover:text-cyan-400" title="Edit">
          <Edit className="w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Skill</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <p className="text-primary font-bold text-lg mb-2">Images</p>
              <div className="flex gap-4 flex-wrap">
                {!imagePreview.length && (
                  <NMImageUploader
                    setImageFiles={setImageFiles}
                    setImagePreview={setImagePreview}
                    label="Update Image"
                    className="w-fit mt-0"
                  />
                )}

                <ImagePreviewer
                  className="flex flex-wrap gap-4"
                  setImageFiles={setImageFiles}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? "Updating Skill..." : "Update Skill"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
