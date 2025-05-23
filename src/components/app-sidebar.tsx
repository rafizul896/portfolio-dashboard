"use client";

import {
  BicepsFlexed,
  BookType,
  Contact,
  FolderGit2,
  Home,
  SquareActivity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavUser from "./modules/auth/NavUser";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin/home",
    icon: Home,
  },
  {
    title: "Blog",
    url: "/admin/blog",
    icon: BookType,
  },
  {
    title: "Project",
    url: "/admin/project",
    icon: FolderGit2,
  },
  {
    title: "Skill",
    url: "/admin/skill",
    icon: BicepsFlexed,
  },
  {
    title: "Experience",
    url: "/admin/experience",
    icon: SquareActivity,
  },
  {
    title: "Contact",
    url: "/admin/contact",
    icon: Contact,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-slate-900 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-xl pb-2">
            Portfolio Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname?.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="hover:bg-cyan-200 text-white"
                      asChild
                    >
                      <Link
                        href={item.url}
                        className={`flex items-center  gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${isActive && "bg-cyan-500 text-white"}
                          `}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t  bg-slate-900 text-white border-[#2a2a3b] pt-3 px-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
