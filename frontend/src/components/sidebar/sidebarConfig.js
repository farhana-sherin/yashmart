import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Gift, 
  Tag, 
  Settings,
  Briefcase
} from "lucide-react";

export const getSidebarConfig = (role) => {
  const allRoutes = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["ADMIN", "STAFF", "CUSTOMER"],
    },
    {
      title: "Attendance",
      path: "/attendance",
      icon: CalendarCheck,
      roles: ["ADMIN", "STAFF"],
    },
    {
      title: "Customers",
      path: "/customers",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      title: "Staff",
      path: "/staff",
      icon: Briefcase,
      roles: ["ADMIN"],
    },
    {
      title: "Rewards",
      path: "/rewards",
      icon: Gift,
      roles: ["ADMIN", "CUSTOMER"],
    },
    {
      title: "Offers",
      path: "/offers",
      icon: Tag,
      roles: ["ADMIN", "STAFF"],
    },
    {
      title: "Browse Offers",
      path: "/browse-offers",
      icon: Tag,
      roles: ["CUSTOMER"],
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["ADMIN"],
    },
  ];

  return allRoutes.filter(route => route.roles.includes(role));
};
