import {
  Settings,
  HomeIcon,
  CameraIcon,
  Workflow,
  Clipboard,
  Layers,
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
        title: "Create Dsmm Task",
        url: "/dsmmadmin/create-dsmm-task",
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
        url: "/dsmmadmin/dsmm-multitaskings",
      },
      {
        title: "Create Multitasking",
        url: "/dsmmadmin/create-dsmm-multitasking",
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
