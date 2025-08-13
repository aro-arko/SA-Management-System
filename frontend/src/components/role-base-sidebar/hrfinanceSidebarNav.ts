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

export const hrfinanceadminNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/hrfinanceadmin/my-tasks",
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
        url: "/hrfinanceadmin/lmu-multitaskings",
      },
      {
        title: "EMU Multitaskings",
        url: "/hrfinanceadmin/emu-multitaskings",
      },
      {
        title: "DSMM Multitaskings",
        url: "/hrfinanceadmin/dsmm-multitaskings",
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
        url: "/hrfinanceadmin/hr-tasks",
      },
      {
        title: "HR Tasks",
        url: "/hrfinanceadmin/hr-tasks",
      },
      {
        title: "New Applications",
        url: "/hrfinanceadmin/hr-new-applications",
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
        url: "/hrfinanceadmin/users",
      },
      {
        title: "Create new User",
        url: "/hrfinanceadmin/create-user",
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
        url: "/hrfinanceadmin/profile",
      },
      {
        title: "Change Password",
        url: "/hrfinanceadmin/change-password",
      },
    ],
  },
];
