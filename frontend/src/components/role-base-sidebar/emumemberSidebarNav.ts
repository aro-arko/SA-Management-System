import {
  LayoutDashboard,
  Settings,
  HomeIcon,
  Calendar,
  Workflow,
  Layers,
} from "lucide-react";

export const emumemberNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/emumember/my-tasks",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Multitaskings",
    url: "#",
    icon: Workflow,
    items: [
      {
        title: "LMU Multitaskings",
        url: "/emumember/lmu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/emumember/dsmm-multitaskings",
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
        url: "/emumember/event-tasks",
      },
    ],
  },
  {
    title: "Multitasking & Others",
    url: "#",
    icon: Layers,
    items: [
      {
        title: "Mutitaskings",
        url: "/emumember/emu-multitaskings",
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
        url: "/emumember/profile",
      },
      {
        title: "Change Password",
        url: "/emumember/change-password",
      },
    ],
  },
];
