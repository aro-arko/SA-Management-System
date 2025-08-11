import { LayoutDashboard, Settings, HomeIcon, Calendar } from "lucide-react";

export const emuadminNavMain = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Dashboard",
    url: "/emuadmin/dashboard",
    icon: LayoutDashboard,
    isActive: true,
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
    icon: Calendar,
    items: [
      {
        title: "Mutitaskings",
        url: "/emuadmin/multitaskings",
      },
      {
        title: "Create Multitasking",
        url: "/emuadmin/create-event-task",
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
