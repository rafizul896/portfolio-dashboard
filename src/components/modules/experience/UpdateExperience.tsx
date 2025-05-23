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
import { Edit } from "lucide-react";

import NMImageUploader from "@/components/core/ImageUploader";
import ImagePreviewer from "@/components/core/ImageUploader/ImagePreviewer";
import { TExperience } from "@/types/experience.type";
import { toast } from "sonner";
import { updateExperience } from "@/services/experience"; // You must create this service function

export default function UpdateExperienceModal({
  experience,
}: {
  experience: TExperience;
}) {
  const [open, setOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[]>(
    experience.companyLogo ? [experience.companyLogo] : []
  );

  const form = useForm({
    defaultValues: {
      title: experience.title || "",
      company: experience.company || "",
      location: experience.location || "",
      from: experience.from
        ? new Date(experience.from).toISOString().split("T")[0]
        : "",
      to: experience.to
        ? new Date(experience.to).toISOString().split("T")[0]
        : "",
      current: experience.current || false,
      description: experience.description || "",
    },
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;

  const isCurrentlyWorking = watch("current");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    const finalData = {
      ...data,
      from: new Date(data.from),
      to: data.current ? null : new Date(data.to),
    };

    formData.append("data", JSON.stringify(finalData));
    imageFiles.forEach((file) => formData.append("file", file));

    try {
      const res = await updateExperience(experience._id, formData);
      toast.success(res.message || "Experience updated successfully!");
      setOpen(false);
      setImageFiles([]);
      setImagePreview([]);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-gray-500 cursor-pointer hover:text-cyan-400"
          title="Edit"
        >
          <Edit className="w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Experience</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Frontend Developer" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Google" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Remote / Dhaka" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isCurrentlyWorking && (
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Currently Working</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="text-primary font-semibold text-base mb-2">
                Company Logo
              </p>
              <div className="flex gap-4 flex-wrap">
                {!imagePreview.length && (
                  <NMImageUploader
                    setImageFiles={setImageFiles}
                    setImagePreview={setImagePreview}
                    label="Change Logo"
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Experience"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
