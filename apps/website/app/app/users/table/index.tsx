"use client";

import { WithXataMetadata } from "@station/db";
import { User } from "@/schema/user";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  SortDirection,
  ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import { columns } from "./helpers";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "@/shared/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

function SortIcon({ sort }: { sort: SortDirection | false }) {
  const Icon = useMemo(
    () => (sort === "desc" ? ChevronDownIcon : ChevronUpIcon),
    [sort]
  );
  if (!sort) return null;
  return <Icon className="w-4 h-4 inline ml-2" />;
}

const hideOnViewPort = <TData,>(columnDef: ColumnDef<TData>) => {
  const viewport = columnDef.meta?.hideOnViewPort;
  if (viewport) {
    return `hidden ${viewport === "sm" ? "sm:table-cell" : "lg:table-cell"}`;
  }
  return "";
};

export function UserTable({ data }: { data: WithXataMetadata<User>[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const { push, prefetch: routerPrefetch } = useRouter();
  const prefetchMap = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const prefetch = (route: string) => (e: React.MouseEvent) => {
    if (e.type === "mouseenter") {
      // Create a new timeout to fetch a new router;
      prefetchMap.current.set(
        route,
        setTimeout(() => {
          routerPrefetch(route);
        }, 300)
      );
    }
    if (e.type === "mouseleave") {
      // Remove the current timeout if exists
      const timeout = prefetchMap.current.get(route);
      if (timeout) {
        clearTimeout(timeout);
      }
      prefetchMap.current.delete(route);
    }
  };

  return (
    <div className="relative overflow-x-auto whitespace-nowrap">
      <table className="border-collapse w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={`bg-white bg-opacity-10`} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={classNames(
                    "py-4 text-sm sm:text-base",
                    hideOnViewPort(header.column.columnDef),
                    header.index === 0 && "rounded-tl-lg",
                    header.index === headerGroup.headers.length - 1 &&
                      "rounded-tr-lg"
                  )}
                  key={header.id}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <SortIcon sort={header.column.getIsSorted()} />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-600 bg-black rounded-b-lg">
          {table.getRowModel().rows.map((row) => (
            <tr
              onClick={() => {
                push(`/app/users/${row.original.id}`);
              }}
              onMouseEnter={prefetch(`/app/users/${row.original.id}`)}
              onMouseLeave={prefetch(`/app/users/${row.original.id}`)}
              key={row.id}
              title={`ดูข้อมูลผู้ใช้ของ ${row.original.name}`}
              className="cursor-pointer hover:bg-white hover:bg-opacity-10"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className={classNames(
                    `py-4 px-2 sm:px-4 text-sm sm:text-base`,
                    hideOnViewPort(cell.column.columnDef)
                  )}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
