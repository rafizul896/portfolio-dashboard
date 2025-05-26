"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlock from "@tiptap/extension-code-block";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Link as LinkIcon,
  Upload,
  ChevronDown,
  FileCode,
  Type,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

import NMImageUploader from "@/components/core/ImageUploader";
import ImagePreviewer from "@/components/core/ImageUploader/ImagePreviewer";
import { getBlogById, updateBlog } from "@/services/blog";
import { toast } from "sonner";

// Font Size Extension
import { Editor, Extension } from "@tiptap/core";
import DashboardLoading from "@/components/modules/dashboard/DashboardLoading";

// FontSize extension (same as AddBlogModal)
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: any) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes: any) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

// Custom Image Extension with alignment and sizing (same as AddBlogModal)
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "left",
        parseHTML: (element: any) =>
          element.getAttribute("data-align") ||
          (element.style.display === "block" &&
            element.style.marginLeft === "auto")
            ? "center"
            : "left",
        renderHTML: (attributes: any) => {
          if (attributes.align === "center") {
            return {
              "data-align": "center",
              style: "display: block; margin: 0 auto;",
            };
          }
          return { "data-align": attributes.align };
        },
      },
      width: {
        default: null,
        parseHTML: (element: any) =>
          element.getAttribute("width") || element.style.width,
        renderHTML: (attributes: any) => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; ${
              attributes.align === "center"
                ? "display: block; margin: 0 auto;"
                : ""
            }`,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element: any) =>
          element.getAttribute("height") || element.style.height,
        renderHTML: (attributes: any) => {
          if (!attributes.height) return {};
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (align: string) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes("image", { align });
        },
      setImageSize:
        (width: string, height: string | null = null) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes("image", { width, height });
        },
    };
  },
});

// TiptapToolbar (same as AddBlogModal)
const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [showImageSizeModal, setShowImageSizeModal] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showHighlightDropdown, setShowHighlightDropdown] = useState(false);

  if (!editor) return null;

  const imageSizes = [
    { label: "Small", value: "200px" },
    { label: "Medium", value: "400px" },
    { label: "Large", value: "600px" },
    { label: "Full Width", value: "100%" },
  ];

  const headingLevels = [
    { label: "Paragraph", level: 0, icon: Type },
    { label: "Heading 1", level: 1, icon: Heading1 },
    { label: "Heading 2", level: 2, icon: Heading2 },
    { label: "Heading 3", level: 3, icon: Heading3 },
  ];

  const highlightColors = [
    { label: "Yellow", color: "#fef08a" },
    { label: "Green", color: "#bbf7d0" },
    { label: "Blue", color: "#bfdbfe" },
    { label: "Pink", color: "#fbcfe8" },
    { label: "Purple", color: "#ddd6fe" },
    { label: "Orange", color: "#fed7aa" },
    { label: "Red", color: "#fecaca" },
    { label: "Gray", color: "#e5e7eb" },
  ];

  const addImageFromFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setShowImageDropdown(false);
  };

  const addImageFromURL = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowImageDropdown(false);
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
  };

  const setHeading = (level: number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
        .run();
    }
    setShowHeadingDropdown(false);
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
    setShowHighlightDropdown(false);
  };

  const removeHighlight = () => {
    editor.chain().focus().unsetHighlight().run();
    setShowHighlightDropdown(false);
  };

  const centerImage = () => {
    (editor.chain().focus() as any).setImageAlign("center").run();
  };

  const alignImageLeft = () => {
    (editor.chain().focus() as any).setImageAlign("left").run();
    setShowImageDropdown(false);
  };

  const alignImageRight = () => {
    (editor.chain().focus() as any).setImageAlign("right").run();
    setShowImageDropdown(false);
  };

  const setImageSize = (width: string) => {
    (editor.chain().focus() as any).setImageSize(width).run();
    setShowImageDropdown(false);
  };

  const openImageSizeModal = () => {
    setShowImageSizeModal(true);
    setShowImageDropdown(false);
  };

  const applyCustomImageSize = () => {
    const width = (document.getElementById("imageWidth") as HTMLInputElement)
      ?.value;
    const height = (document.getElementById("imageHeight") as HTMLInputElement)
      ?.value;

    if (width) {
      const formattedWidth =
        width + (width.includes("%") || width.includes("px") ? "" : "px");
      const formattedHeight =
        height && height !== ""
          ? height + (height.includes("%") || height.includes("px") ? "" : "px")
          : "auto";

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          style: `width: ${formattedWidth}; height: ${formattedHeight};`,
        })
        .run();
    }

    setShowImageSizeModal(false);
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      {/* Heading Dropdown */}
      <div className="relative inline-block">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
        >
          {editor.isActive("heading", { level: 1 }) ? (
            <Heading1 className="h-4 w-4" />
          ) : editor.isActive("heading", { level: 2 }) ? (
            <Heading2 className="h-4 w-4" />
          ) : editor.isActive("heading", { level: 3 }) ? (
            <Heading3 className="h-4 w-4" />
          ) : (
            <Type className="h-4 w-4" />
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>

        {showHeadingDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]">
            {headingLevels.map((heading) => {
              const IconComponent = heading.icon;
              return (
                <button
                  key={heading.level}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                    (heading.level === 0 && !editor.isActive("heading")) ||
                    editor.isActive("heading", { level: heading.level })
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={() => setHeading(heading.level)}
                >
                  <IconComponent className="h-4 w-4" />
                  {heading.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-gray-200" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-gray-200" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "bg-gray-200" : ""}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      {/* Highlight Dropdown */}
      <div className="relative inline-block">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${
            editor.isActive("highlight") ? "bg-gray-200" : ""
          }`}
          onClick={() => setShowHighlightDropdown(!showHighlightDropdown)}
        >
          <Highlighter className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>

        {showHighlightDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[160px]">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
              Highlight Colors
            </div>
            {highlightColors.map((highlight) => (
              <button
                key={highlight.color}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setHighlight(highlight.color)}
              >
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: highlight.color }}
                />
                {highlight.label}
              </button>
            ))}
            <div className="border-t border-gray-100">
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                onClick={removeHighlight}
              >
                Remove Highlight
              </button>
            </div>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "bg-gray-200" : ""}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={insertCodeBlock}
        className={editor.isActive("codeBlock") ? "bg-gray-200" : ""}
        title="Code Block"
      >
        <FileCode className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
        }
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Image Upload Dropdown */}
      <div className="relative inline-block">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setShowImageDropdown(!showImageDropdown)}
        >
          <ImageIcon className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>

        {showImageDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[180px]">
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100"
              onClick={addImageFromFile}
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </button>
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100"
              onClick={addImageFromURL}
            >
              <ImageIcon className="h-4 w-4" />
              Image URL
            </button>
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
              Image Alignment
            </div>
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              onClick={alignImageLeft}
            >
              <AlignLeft className="h-4 w-4" />
              Align Left
            </button>
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              onClick={centerImage}
            >
              <AlignCenter className="h-4 w-4" />
              Center Image
            </button>
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100"
              onClick={alignImageRight}
            >
              <AlignRight className="h-4 w-4" />
              Align Right
            </button>
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
              Image Size
            </div>
            {imageSizes.map((size) => (
              <button
                key={size.value}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => setImageSize(size.value)}
              >
                {size.label} ({size.value})
              </button>
            ))}
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              onClick={openImageSizeModal}
            >
              <Type className="h-4 w-4" />
              Custom Size
            </button>
          </div>
        )}
      </div>

      {/* Custom Image Size Modal */}
      {showImageSizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Set Image Size</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="imageWidth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Width (px, %, or auto)
                </label>
                <input
                  type="text"
                  id="imageWidth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 300px, 50%, auto"
                />
              </div>
              <div>
                <label
                  htmlFor="imageHeight"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Height (optional)
                </label>
                <input
                  type="text"
                  id="imageHeight"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 200px, auto"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={applyCustomImageSize}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageSizeModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button type="button" variant="ghost" size="sm" onClick={addLink}>
        <LinkIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function UpdateBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);
  const [loading, setLoading] = useState(true);

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

  // Editor instance
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  // Editor content management
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
      }),
      TextStyle,
      FontSize,
      FontFamily,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: { class: "tiptap-highlight" },
      }),
      BulletList.configure({
        HTMLAttributes: { class: "tiptap-bullet-list" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "tiptap-ordered-list" },
      }),
      ListItem.configure({
        HTMLAttributes: { class: "tiptap-list-item" },
      }),
      CodeBlock.configure({
        HTMLAttributes: { class: "tiptap-code-block" },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md my-2",
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      form.setValue("content", html);
    },
  });

  useEffect(() => {
    if (editor) setEditorInstance(editor);
  }, [editor]);

  // Load existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data } = await getBlogById(id);
        const blog = data;

        form.reset({
          title: blog.title,
          content: blog.content,
          author: blog.author,
          category: blog.category,
          tags: blog.tags ? blog.tags.join(", ") : "",
          isPublished: blog.isPublished,
        });
        if (editor) {
          editor.commands.setContent(blog.content || "");
        }
        // If your blog has a thumbnail, handle its preview here
        if (blog.thumbnailUrl) {
          setImagePreview([blog.thumbnailUrl]);
        }
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err?.message || "Failed to load blog data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editor]);

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
      const res = await updateBlog(id, formData);

      toast.success(res.message || "Blog updated successfully!");
      router.push("/admin/blog");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="">
      <h1 className="font-medium text-xl pb-5">Update Blog</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
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
            render={() => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <TiptapToolbar editor={editorInstance} />
                    <EditorContent
                      editor={editorInstance}
                      className="prose prose-sm max-w-none p-4 min-h-[200px] focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-2"
                    />
                    <style jsx global>{`
                      .ProseMirror h1 {
                        font-size: 2.25rem;
                        font-weight: bold;
                        line-height: 1.2;
                        margin: 1.5rem 0 1rem 0;
                      }
                      .ProseMirror h2 {
                        font-size: 1.875rem;
                        font-weight: bold;
                        line-height: 1.3;
                        margin: 1.25rem 0 0.75rem 0;
                      }
                      .ProseMirror h3 {
                        font-size: 1.5rem;
                        font-weight: bold;
                        line-height: 1.4;
                        margin: 1rem 0 0.5rem 0;
                      }
                      .ProseMirror mark.tiptap-highlight {
                        padding: 0.125rem 0.25rem;
                        border-radius: 0.25rem;
                        color: inherit;
                      }
                      .ProseMirror ul.tiptap-bullet-list {
                        list-style-type: disc;
                        margin-left: 1rem;
                        padding-left: 1rem;
                      }
                      .ProseMirror ol.tiptap-ordered-list {
                        list-style-type: decimal;
                        margin-left: 1rem;
                        padding-left: 1rem;
                      }
                      .ProseMirror li.tiptap-list-item {
                        margin: 0.25rem 0;
                      }
                      .ProseMirror ul,
                      .ProseMirror ol {
                        margin: 0.5rem 0;
                      }
                      .ProseMirror ul li,
                      .ProseMirror ol li {
                        list-style-position: outside;
                      }
                      .ProseMirror pre.tiptap-code-block {
                        background: #f8f9fa;
                        border: 1px solid #e9ecef;
                        border-radius: 0.375rem;
                        color: #495057;
                        font-family: "JetBrains Mono", "Menlo", "Monaco",
                          Consolas, "Courier New", monospace;
                        padding: 0.75rem 1rem;
                        margin: 1rem 0;
                        overflow-x: auto;
                      }
                      .ProseMirror pre.tiptap-code-block code {
                        background: none;
                        font-size: 0.875rem;
                        padding: 0;
                      }
                      .ProseMirror img[data-align="center"] {
                        display: block !important;
                        margin-left: auto !important;
                        margin-right: auto !important;
                      }
                      .ProseMirror img[data-align="right"] {
                        float: right;
                        margin-left: 1rem;
                      }
                      .ProseMirror img[data-align="left"] {
                        float: left;
                        margin-right: 1rem;
                      }
                    `}</style>
                  </div>
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
              {!imagePreview.length && (
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

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Updating Blog..." : "Update Blog"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
