import {
  Users,
  Settings,
  HomeIcon,
  Workflow,
  ClipboardList,
  Database,
  Layers,
} from "lucide-react";

export const lmuAdminNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/lmuadmin/my-tasks",
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
        url: "/lmuadmin/emu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/lmuadmin/dsmm-multitaskings",
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
        url: "/lmuadmin/leads-tasks",
      },
      {
        title: "Create Leads Task",
        url: "/lmuadmin/create-leads-task",
      },
      {
        title: "Leads Goals",
        url: "/lmuadmin/leads-goals",
      },
      {
        title: "Create Leads Goal",
        url: "/lmuadmin/create-leads-goal",
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
        url: "/lmuadmin/data-entry-tasks",
      },
      {
        title: "Data Batches",
        url: "/lmuadmin/data-batches",
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
        url: "/lmuadmin/lmu-multitaskings",
      },
      {
        title: "Others",
        url: "/lmuadmin/lmu-others",
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
        url: "/lmuadmin/profile",
      },
      {
        title: "Change Password",
        url: "/lmuadmin/change-password",
      },
    ],
  },
];
