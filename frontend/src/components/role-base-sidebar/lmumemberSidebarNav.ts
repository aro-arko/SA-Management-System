import {
  Users,
  Settings,
  HomeIcon,
  Workflow,
  ClipboardList,
  Database,
  Layers,
} from "lucide-react";

export const lmumemberNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/lmumember/my-tasks",
    icon: ClipboardList,
    isActive: true,
  },
  {
    title: "Multitaskings",
    url: "#",
    icon: Workflow,
    items: [
      {
        title: "EMU Multitaskings",
        url: "/lmumember/emu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/lmumember/dsmm-multitaskings",
      },
    ],
  },
  {
    title: "Leads Management",
    url: "#",
    icon: Users,
    items: [
      {
        title: "Leads Tasks",
        url: "/lmumember/leads-tasks",
      },
      {
        title: "Leads Goals",
        url: "/lmumember/leads-goals",
      },
    ],
  },
  {
    title: "Data Management",
    url: "#",
    icon: Database,
    items: [
      {
        title: "Data Entry Tasks",
        url: "/lmumember/data-entry-tasks",
      },

      {
        title: "Data Batches",
        url: "/lmumember/data-batches",
      },
    ],
  },
  {
    title: "Multitasking & Others",
    url: "#",
    icon: Layers,
    items: [
      {
        title: "Multitaskings",
        url: "/lmumember/lmu-multitaskings",
      },
      {
        title: "Others",
        url: "/lmumember/lmu-others",
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
        url: "/lmumember/profile",
      },
      {
        title: "Change Password",
        url: "/lmumember/change-password",
      },
    ],
  },
];
