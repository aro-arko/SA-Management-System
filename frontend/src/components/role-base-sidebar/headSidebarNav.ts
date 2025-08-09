import {
  Users,
  Settings,
  HomeIcon,
  Calendar,
  CameraIcon,
  Briefcase,
  Users2,
  Workflow,
  Clipboard,
} from "lucide-react";

export const headNavMain = [
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
        title: "LMU Multitaskings",
        url: "/head/multitaskings/lmu-multitaskings",
      },
      {
        title: "EMU Multitaskings",
        url: "/head/multitaskings/emu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/head/multitaskings/dsmm-multitaskings",
      },
      {
        title: "HR Multitaskings",
        url: "/head/multitaskings/hr-finance-multitaskings",
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
    title: "Event Management Unit",
    url: "#",
    icon: Calendar,
    items: [
      {
        title: "Event Tasks",
        url: "/head/event-tasks",
      },
      {
        title: "Multitaskings",
        url: "/head/emu-multitaskings",
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
        url: "/head/dsmm-tasks",
      },
      {
        title: "Multitaskings",
        url: "/head/dsmm-multitaskings",
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
        url: "/head/hr-tasks",
      },
      {
        title: "New Applications",
        url: "/head/hr-new-applications",
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
        url: "/head/users",
      },
      {
        title: "Create new User",
        url: "/head/create-user",
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
