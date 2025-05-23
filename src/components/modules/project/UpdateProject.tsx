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
import { FieldValues, useForm } from "react-hook-form";

import NMImageUploader from "@/components/core/ImageUploader";
import ImagePreviewer from "@/components/core/ImageUploader/ImagePreviewer";
import { updateProject } from "@/services/project"; // Your update service
import { toast } from "sonner";
import { TProject } from "@/types/project.type";
import { Edit } from "lucide-react";

const tagFields = [
  "features",
  "technologies",
  "improvements",
  "challenges",
] as const;

type TagField = (typeof tagFields)[number]; // Union type: "features" | "technologies" | "improvements" | "challenges"

export default function UpdateProjectModal({ project }: { project: TProject }) {
  const [open, setOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>(
    project.thumbnail ? [project.thumbnail] : []
  );

  const form = useForm({
    defaultValues: {
      title: project.title || "",
      description: project.description || "",
      liveUrl: project.liveUrl || "",
      githubFrontend: project.githubRepoUrl?.frontend || "",
      githubBackend: project.githubRepoUrl?.backend || "",
      features: (project.features || []).join(", "),
      improvements: (project.improvements || []).join(", "),
      challenges: (project.challenges || []).join(", "),
      technologies: (project.technologies || []).join(", "),
      category: project.category || "",
      order: project.order || 0,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData();

    const {
      githubFrontend,
      githubBackend,
      features,
      technologies,
      improvements,
      challenges,
      ...rest
    } = data;

    const formattedData = {
      ...rest,
      githubRepoUrl: {
        frontend: githubFrontend,
        backend: githubBackend,
      },
      features: features.split(",").map((f: string) => f.trim()),
      technologies: technologies.split(",").map((t: string) => t.trim()),
      improvements: improvements
        ? improvements.split(",").map((i: string) => i.trim())
        : [],
      challenges: challenges
        ? challenges.split(",").map((c: string) => c.trim())
        : [],
      order: Number(data.order),
    };

    formData.append("data", JSON.stringify(formattedData));
    imageFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const res = await updateProject(project._id, formData);
      toast.success(res.message || "Project updated successfully");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
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

      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* GitHub URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="githubFrontend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Frontend URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubBackend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Backend URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            {tagFields.map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name as TagField}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {name.charAt(0).toUpperCase() + name.slice(1)} (comma
                      separated)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Thumbnail */}
            <div>
              <p className="text-primary font-semibold mb-2">Thumbnail</p>
              <div className="flex gap-4 flex-wrap">
                {!imagePreview.length && (
                  <NMImageUploader
                    setImageFiles={setImageFiles}
                    setImagePreview={setImagePreview}
                    label="Update Thumbnail"
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

            {/* Submit Button */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? "Updating Project..." : "Update Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
