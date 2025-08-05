import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  HomeIcon,
  Calendar,
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
    title: "Goals",
    url: "/coordinator/lmu-goals",
    icon: BarChart2,
    items: [],
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
