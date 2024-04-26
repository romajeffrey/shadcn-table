import * as React from "react"
import type { SearchParams } from "@/types"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { Shell } from "@/components/shell"

import { TasksTable } from "./_components/tasks-table"
import { TasksTableProvider } from "./_components/tasks-table-provider"
import { getTasks } from "./_lib/queries"
import { searchParamsSchema } from "./_lib/validations"

export interface IndexPageProps {
  searchParams: SearchParams
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  // const tasksPromise = getTasks(search)
  const tasksPromise: Promise<{
    data: {
      title: string | null
      status: "todo" | "in-progress" | "done" | "canceled"
      priority: "low" | "medium" | "high"
      code: string | null
      id: string
      label: "bug" | "feature" | "enhancement" | "documentation"
      createdAt: Date
      updatedAt: Date | null
    }[]
    pageCount: number
  }> = Promise.resolve({
    data: [
      {
        title: "Task 1",
        status: "todo",
        priority: "low",
        code: "T1",
        id: "1",
        label: "bug",
        createdAt: new Date("2024-04-26T10:00:00"),
        updatedAt: null,
      },
      {
        title: "Task 2",
        status: "in-progress",
        priority: "medium",
        code: "T2",
        id: "2",
        label: "feature",
        createdAt: new Date("2024-04-25T12:00:00"),
        updatedAt: new Date("2024-04-26T08:30:00"),
      },
      // Add more tasks as needed
    ],
    pageCount: 1, // Example pageCount
  })

  // Usage example:
  tasksPromise.then((tasksData) => {
    console.log(tasksData)
  })

  return (
    <Shell className="gap-2">
      {/**
       * The `TasksTableProvider` is use to enable some feature flags for the `TasksTable` component.
       * Feel free to remove this, as it's not required for the `TasksTable` component to work.
       */}
      <TasksTableProvider>
        {/**
         * The `DateRangePicker` component is used to render the date range picker UI.
         * It is used to filter the tasks based on the selected date range it was created at.
         * The business logic for filtering the tasks based on the selected date range is handled inside the component.
         */}
        <DateRangePicker
          triggerSize="sm"
          triggerClassName="ml-auto w-56 sm:w-60"
          align="end"
        />
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/**
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
          <TasksTable tasksPromise={tasksPromise} />
        </React.Suspense>
      </TasksTableProvider>
    </Shell>
  )
}
