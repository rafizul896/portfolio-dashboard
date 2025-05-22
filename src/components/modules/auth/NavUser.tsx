"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/services/auth";
import { useEffect, useState } from "react";

// ✅ Optional: Define a type for the user
type UserType = {
  name: string;
  email: string;
  avatarUrl?: string;
};

const NavUser = () => {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getCurrentUser();
        setUser(res);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchData();
  }, []);

  const handleLogOut = async () => {
    try {
      await logoutUser();
      toast.success("Logout successful!");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  return (
    <SidebarMenu >
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-full">
              <button
                className="flex cursor-pointer w-full items-center gap-3 rounded-md p-2"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user?.avatarUrl ??
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&s"
                    }
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "Rafizul Islam"}
                  </span>
                  <span className="truncate text-xs text-gray-400">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </button>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user?.avatarUrl ??
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&s"
                    }
                    alt={user?.email || "user"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.charAt(0).toUpperCase() || "Rafizul Islam"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "Rafizul Islam"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:text-red-500 bg-red-50 cursor-pointer"
              onClick={handleLogOut}
            >
              <LogOut className="mr-2 h-4 w-4 hover:text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
