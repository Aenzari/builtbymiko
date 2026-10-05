import type { IconName } from "./icons";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Stack", href: "/stack", icon: "layers" },
  { label: "About", href: "/about", icon: "user" },
  { label: "Contact", href: "/contact", icon: "mail" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
