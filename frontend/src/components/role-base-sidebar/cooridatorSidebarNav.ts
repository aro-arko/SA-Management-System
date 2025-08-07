import {
  LayoutDashboard,
  Users,
  Settings,
  HomeIcon,
  Calendar,
  CameraIcon,
  Briefcase,
  Users2,
} from "lucide-react";

export const coordinatorNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Dashboard",
    url: "/coordinator/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Leads Management Unit",
    url: "#",
    icon: Users,
    items: [
      {
        title: "Leads Tasks",
        url: "/coordinator/leads-tasks",
      },
      {
        title: "Leads Goals",
        url: "/coordinator/leads-goals",
      },
      {
        title: "Data Entry Tasks",
        url: "/coordinator/data-entry-tasks",
      },
      {
        title: "Data Batches",
        url: "/coordinator/data-batches",
      },
      {
        title: "Multitaskings",
        url: "/coordinator/lmu-multitaskings",
      },
      {
        title: "Others",
        url: "/coordinator/lmu-others",
      },
    ],
  },
  {
    title: "Event Management Unit",
    url: "#",
    icon: Calendar,
    items: [
      {
        title: "Event Tasks",
        url: "/coordinator/event-tasks",
      },
      {
        title: "Multitaskings",
        url: "/coordinator/emu-multitaskings",
      },
    ],
  },
  {
    title: "Digital & Marketing Unit",
    url: "#",
    icon: CameraIcon,
    items: [
      {
        title: "Dsmm Tasks",
        url: "/coordinator/dsmm-tasks",
      },
      {
        title: "Multitaskings",
        url: "/coordinator/dsmm-multitaskings",
      },
    ],
  },
  {
    title: "HR & Finance Unit",
    url: "#",
    icon: Briefcase,
    items: [
      {
        title: "HR Tasks",
        url: "/coordinator/hr-tasks",
      },
      {
        title: "New Applications",
        url: "/coordinator/hr-new-applications",
      },
    ],
  },
  {
    title: "User Management",
    url: "#",
    icon: Users2,
    items: [
      {
        title: "Users",
        url: "/coordinator/users",
      },
      {
        title: "Create new User",
        url: "/coordinator/create-user",
      },
    ],
  },

  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      {
        title: "Profile",
        url: "/coordinator-profile",
      },
      {
        title: "Change Password",
        url: "/change-password",
      },
    ],
  },
];
