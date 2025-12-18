"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { roleMenus } from "@/data/dummyData";

const groupBySection = (items = []) =>
  items.reduce((acc, item) => {
    const key = item.section || "General";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

export default function Sidebar({
  role,
  collapsed,
  isVisible,
  isDisabled = false,
  onCollapseToggle,
  onCloseMobile,
}) {
  const pathname = usePathname();
  const groupedMenus = useMemo(() => {
    const navItems = roleMenus[role] ?? roleMenus.Admin;
    return groupBySection(navItems);
  }, [role]);
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  const handleSectionToggle = (section) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <>
      {isVisible && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "lg:w-72"} ${isDisabled ? "sidebar-disabled" : ""}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/10 p-2 text-xl text-blue-600">
              🏠
            </span>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold tracking-wide text-slate-900">
                  Airbnb
                </p>
                <p className="text-xs text-slate-500">Hospitality Ops</p>
              </div>
            )}
          </div>
          <button
            className="hidden rounded-full border border-slate-200 p-1 text-slate-500 hover:bg-slate-50 lg:inline-flex"
            onClick={onCollapseToggle}
            aria-label="Toggle sidebar width"
            disabled={isDisabled}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-2 pb-6">
          {Object.entries(groupedMenus).map(([section, items]) => (
            <div
              key={section}
              className="rounded-xl border border-transparent px-2 py-1 hover:border-slate-100"
            >
              <button
                className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                onClick={() => handleSectionToggle(section)}
                disabled={isDisabled}
              >
                <span>{section}</span>
                <span>{collapsedSections.has(section) ? "+" : "−"}</span>
              </button>
              {!collapsedSections.has(section) && (
                <nav className="mt-1 space-y-1">
                  {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={isDisabled ? "#" : item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                        onClick={(e) => {
                          if (isDisabled) {
                            e.preventDefault();
                          } else {
                            onCloseMobile();
                          }
                        }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

