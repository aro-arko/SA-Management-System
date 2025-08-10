"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/UserContext";
import { coordinatorNavMain } from "../role-base-sidebar/cooridatorSidebarNav";
import { headNavMain } from "../role-base-sidebar/headSidebarNav";
import { lmuAdminNavMain } from "../role-base-sidebar/lmuadminSidebarNav";
import { lmudataleaderNavMain } from "../role-base-sidebar/lmudataleaderSidebarNav";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser();

  if (isLoading || !user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-4 py-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 py-2 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </SidebarContent>

        <SidebarFooter className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    );
  }

  // Get nav based on role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let navMain: any[] = [];
  switch (user.role.toLocaleLowerCase()) {
    case "coordinator":
      navMain = coordinatorNavMain;
      break;
    case "head":
      navMain = headNavMain;
      break;
    case "lmuadmin":
      navMain = lmuAdminNavMain;
      break;
    case "lmudataleader":
      navMain = lmudataleaderNavMain;
      break;
    default:
      navMain = [];
  }

  const currentUser = {
    name: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    email: user.email || "user@example.com",
    avatar: "/avatars/default.png",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
