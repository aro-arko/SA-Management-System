import {
  Users,
  Settings,
  HomeIcon,
  Workflow,
  ClipboardList,
  Database,
  Layers,
} from "lucide-react";

export const lmudataleaderNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/lmudataleader/my-tasks",
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
        url: "/lmudataleader/emu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/lmudataleader/dsmm-multitaskings",
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
        url: "/lmudataleader/leads-tasks",
      },
      {
        title: "Leads Goals",
        url: "/lmudataleader/leads-goals",
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
        url: "/lmudataleader/data-entry-tasks",
      },
      {
        title: "Create Data Entry Task",
        url: "/lmudataleader/create-data-entry-task",
      },
      {
        title: "Data Batches",
        url: "/lmudataleader/data-batches",
      },
      {
        title: "Create Data Batch",
        url: "/lmudataleader/create-data-batch",
      },
    ],
  },
  {
    title: "Data Entry Multitasking",
    url: "#",
    icon: Layers,
    items: [
      {
        title: "Multitaskings",
        url: "/lmudataleader/lmu-multitaskings",
      },
      {
        title: "Create Multitasking",
        url: "/lmudataleader/create-multitasking",
      },
      {
        title: "Others",
        url: "/lmudataleader/lmu-others",
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
        url: "/lmudataleader/profile",
      },
      {
        title: "Change Password",
        url: "/lmudataleader/change-password",
      },
    ],
  },
];
