"use client";

import { WithXataMetadata } from "@/../../packages/db/src";
import { User } from "@/schema/user";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  SortDirection,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { columns } from "./helpers";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

function SortIcon({ sort }: { sort: SortDirection | false }) {
  const Icon = useMemo(
    () => (sort === "desc" ? ChevronDownIcon : ChevronUpIcon),
    [sort]
  );
  if (!sort) return null;
  return <Icon className="w-4 h-4 inline ml-2" />;
}

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
  return (
    <div className="relative overflow-x-auto whitespace-nowrap">
      <table className="border-collapse w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={
                    header.column.columnDef.meta?.hideOnSmallViewPort
                      ? "hidden sm:table-cell"
                      : undefined
                  }
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
        <tbody className="divide-y divide-gray-600">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  className={`py-4 px-2 sm:px-4 text-sm sm:text-base${
                    cell.column.columnDef.meta?.hideOnSmallViewPort
                      ? " hidden sm:table-cell"
                      : ""
                  }`}
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
