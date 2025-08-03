import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";

export const coordinatorNavMain = [
  {
    title: "Dashboard",
    url: "/coordinator/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [],
  },
  {
    title: "Tasks",
    url: "#",
    icon: ClipboardList,
    items: [
      {
        title: "Leads Tasks",
        url: "/coordinator/leads-tasks",
      },
      {
        title: "EMU Tasks",
        url: "/coordinator/emu-tasks",
      },
      {
        title: "DSMM Tasks",
        url: "/coordinator/dsmm-tasks",
      },
      {
        title: "HR & Finance Tasks",
        url: "/coordinator/hrfinance-tasks",
      },
      {
        title: "Others",
        url: "/coordinator/others-tasks",
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
