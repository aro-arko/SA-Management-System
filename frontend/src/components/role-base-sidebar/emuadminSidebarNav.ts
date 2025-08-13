import {
  LayoutDashboard,
  Settings,
  HomeIcon,
  Calendar,
  Workflow,
  Layers,
} from "lucide-react";

export const emuadminNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/emuadmin/my-tasks",
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
        url: "/emuadmin/lmu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/emuadmin/dsmm-multitaskings",
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
        url: "/emuadmin/event-tasks",
      },
      {
        title: "Create Event Task",
        url: "/emuadmin/create-event-task",
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
        url: "/emuadmin/emu-multitaskings",
      },
      {
        title: "Create Multitasking",
        url: "/emuadmin/create-emu-multitasking",
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
        url: "/emuadmin/profile",
      },
      {
        title: "Change Password",
        url: "/emuadmin/change-password",
      },
    ],
  },
];
