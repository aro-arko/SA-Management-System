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

export const dsmmadminNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "My Tasks",
    url: "/dsmmadmin/my-tasks",
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
        url: "/dsmmadmin/lmu-multitaskings",
      },
      {
        title: "EMU Multitaskings",
        url: "/dsmmadmin/emu-multitaskings",
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
        url: "/dsmmadmin/dsmm-tasks",
      },
      {
        title: "Multitaskings",
        url: "/dsmmadmin/dsmm-multitaskings",
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
        url: "/dsmmadmin/hr-tasks",
      },
      {
        title: "New Applications",
        url: "/dsmmadmin/hr-new-applications",
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
        url: "/dsmmadmin/users",
      },
      {
        title: "Create new User",
        url: "/dsmmadmin/create-user",
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
        url: "/dsmmadmin/profile",
      },
      {
        title: "Change Password",
        url: "/dsmmadmin/change-password",
      },
    ],
  },
];
