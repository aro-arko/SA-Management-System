import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  HomeIcon,
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
    icon: ClipboardList,
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
        title: "Multitasking",
        url: "/coordinator/lmu-multitasking",
      },
      {
        title: "Others",
        url: "/coordinator/lmu-others",
      },
    ],
  },
  {
    title: "Multitasking",
    url: "#",
    icon: Users,
    items: [
      {
        title: "LMU Multitasking",
        url: "/coordinator/lmu-multitasking",
      },
      {
        title: "EMU Multitasking",
        url: "/coordinator/emu-multitasking",
      },
      {
        title: "DSMM Multitasking",
        url: "/coordinator/dsmm-multitasking",
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
