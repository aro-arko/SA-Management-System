/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";

import { useUser } from "@/context/UserContext";
import { coordinatorNavMain } from "../role-base-sidebar/cooridatorSidebarNav";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  let navMain: any[] = [];

  switch (user?.role) {
    case "coordinator":
      navMain = coordinatorNavMain;
      break;
    // case "head":
    //   navMain = headNavMain;
    //   break;
    // case "lmuAdmin":
    //   navMain = lmuAdminNavMain;
    //   break;
    default:
      navMain = [];
  }

  const currentUser = {
    name: user?.role
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : "User",
    email: user?.email || "user@example.com",
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
