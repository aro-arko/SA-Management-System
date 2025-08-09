import { Users, Settings, HomeIcon, Workflow, Clipboard } from "lucide-react";

export const lmuAdminNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/head/my-tasks",
    icon: Clipboard,
    isActive: true,
  },
  {
    title: "Multitaskings",
    url: "#",
    icon: Workflow,
    items: [
      {
        title: "EMU Multitaskings",
        url: "/head/emu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/head/dsmm-multitaskings",
      },
    ],
  },
  {
    title: "Leads Management Unit",
    url: "#",
    icon: Users,
    items: [
      {
        title: "Leads Tasks",
        url: "/head/leads-tasks",
      },
      {
        title: "Leads Goals",
        url: "/head/leads-goals",
      },
      {
        title: "Data Entry Tasks",
        url: "/head/data-entry-tasks",
      },
      {
        title: "Data Batches",
        url: "/head/data-batches",
      },
      {
        title: "Multitaskings",
        url: "/head/lmu-multitaskings",
      },
      {
        title: "Others",
        url: "/head/lmu-others",
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
        url: "/head/profile",
      },
      {
        title: "Change Password",
        url: "/head/change-password",
      },
    ],
  },
];
