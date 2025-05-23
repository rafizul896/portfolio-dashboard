"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BicepsFlexed,
  BookType,
  Briefcase,
  FolderGit2,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHome({
  data,
}: {
  data: {
    blogCount: number;
    projectCount: number;
    skillCount: number;
    experienceCount: number;
    contactCount: number;
  };
}) {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-primary">
          Welcome back, Rafizul!
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your portfolio projects, experiences, blog, skill and contact
          message from one place.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Projects */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Projects</CardTitle>
            <FolderGit2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.projectCount}</p>
            <p className="text-sm text-muted-foreground">
              Total showcased projects
            </p>
            <Button
              variant="link"
              className="mt-2 p-0 cursor-pointer"
              onClick={() => router.push("/admin/project")}
            >
              View Projects →
            </Button>
          </CardContent>
        </Card>

        {/* Blog */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Blog</CardTitle>
            <BookType className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.blogCount}</p>
            <p className="text-sm text-muted-foreground">
              Jobs or internships added
            </p>
            <Button
              variant="link"
              className="mt-2 p-0 cursor-pointer"
              onClick={() => router.push("/admin/blog")}
            >
              View Experience →
            </Button>
          </CardContent>
        </Card>

        {/* Skill */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Skill</CardTitle>
            <BicepsFlexed className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.skillCount}</p>
            <p className="text-sm text-muted-foreground">
              Total showcased projects
            </p>
            <Button
              variant="link"
              className="mt-2 p-0 cursor-pointer"
              onClick={() => router.push("/admin/skill")}
            >
              View Projects →
            </Button>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Experience</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.experienceCount}</p>
            <p className="text-sm text-muted-foreground">
              Jobs or internships added
            </p>
            <Button
              variant="link"
              className="mt-2 p-0 cursor-pointer"
              onClick={() => router.push("/admin/experience")}
            >
              View Experience →
            </Button>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Messages</CardTitle>
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.contactCount}</p>
            <p className="text-sm text-muted-foreground">
              New feedback messages
            </p>
            <Button
              variant="link"
              className="mt-2 p-0 cursor-pointer"
              onClick={() => router.push("/admin/contact")}
            >
              View Messages →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
