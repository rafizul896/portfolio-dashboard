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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import NMImageUploader from "@/components/core/ImageUploader";
import ImagePreviewer from "@/components/core/ImageUploader/ImagePreviewer";
import { addBlog } from "@/services/blog";
import { toast } from "sonner";

export default function AddBlogModal() {
  const [open, setOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      author: "",
      category: "",
      tags: "",
      isPublished: false,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    // Handle tags as array
    const tagsArray = data.tags
      ? data.tags.split(",").map((tag: string) => tag.trim())
      : [];

    const finalData = {
      ...data,
      tags: tagsArray,
    };

    formData.append("data", JSON.stringify(finalData));

    for (const file of imageFiles) {
      formData.append("file", file);
    }

    try {
      const res = await addBlog(formData);
      toast.success(res.message);
      setOpen(false);
      form.reset();
      setImageFiles([]);
      setImagePreview([]);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err?.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add Blog</Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Blog</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., react, webdev" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Publish Now</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <p className="text-primary font-semibold text-base mb-2">
                Thumbnail
              </p>
              <div className="flex gap-4 flex-wrap">
                {!imageFiles.length && (
                  <NMImageUploader
                    setImageFiles={setImageFiles}
                    setImagePreview={setImagePreview}
                    label="Upload Thumbnail"
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
                {isSubmitting ? "Adding Blog..." : "Add Blog"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
