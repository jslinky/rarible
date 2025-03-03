<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, ExpandedState  } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { valueUpdater } from '~/lib/utils'

const { data, columns, visibleColumns = {} } = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  visibleColumns?: VisibilityState,
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>(visibleColumns)
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})
// const pagination = ref({
//   pageIndex: 0,
//   pageSize: 10,
// })

const table = useVueTable({
  get data() { return data },
  get columns() { return columns },  
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),  
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  }
})

const tableStyles = ref<{
  table: string;
  thead: Record<string, string>;
  tbody: Record<string, string>;
}>({
  table: 'w-full border-collapse rounded-sm table-fixed min-w-[1200px]',
  thead: {
    tr: 'sticky top-0 bg-background z-20',
    th: 'font-normal uppercase !text-xxs text-gray-500',
    fav: 'w-[4rem]',
    thumb: 'w-[4rem] px-0',
    name: 'w-[12rem] text-left *:justify-start',
    chain: '',
    floor_price: '',
    floor_change: '',
    top_offer: '',
    sales: '',
    owners: '',
    listed: '',
    volume: '',
    floor_chart: 'w-[11rem]'
  },
  tbody: {
    tr: 'border-0 rounded-lg h-[56px]',
    td: 'text-left py-[3px]'
  },
})

defineExpose({
  table
})

</script>

<template>
  <div>
    <Table :class="tableStyles.table ?? ''">
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" :class="tableStyles.thead.tr ?? ''"  >
          <TableHead v-for="header in headerGroup.headers" :key="header.id" :class="(tableStyles.thead[header.id] ?? '') + ' ' + tableStyles.thead.th">
            <FlexRender
              v-if="!header.isPlaceholder" :render="header.column.columnDef.header"              
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows" :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            :class="tableStyles.tbody.tr ?? ''"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :class="tableStyles.tbody.td ?? ''">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
      <!-- <div class="flex items-center gap-2">
        <button
          class="border rounded p-1"
          @click="() => table.firstPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          <<
        </button>
        <button
          class="border rounded p-1"
          @click="() => table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          <
        </button>
        <button
          class="border rounded p-1"
          @click="() => table.nextPage()"
          :disabled="!table.getCanNextPage()"
        >
          >
        </button>
        <button
          class="border rounded p-1"
          @click="() => table.lastPage()"
          :disabled="!table.getCanNextPage()"
        >
          >>
        </button>
        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {{table.getState().pagination.pageIndex + 1}} of{' '}
            {{table.getPageCount().toLocaleString()}}
          </strong>
        </span>
        <span class="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            :max="table.getPageCount()"
            :value="table.getState().pagination.pageIndex + 1"
            @change="e => {
              const target = e.target as HTMLInputElement
              const page = target.value ? Number(target.value) - 1 : 0
              table.setPageIndex(page)              
            }"
            class="border p-1 rounded w-16"
          />
        </span>
        <select
          :value=table.getState().pagination.pageSize
          @change="e => {
            const target = e.target as HTMLInputElement
            table.setPageSize(Number(target.value))
          }"
        >
          <template v-for="pageSize in [10, 20, 30, 40, 50]" :key=pageSize>
            <option :value="pageSize">
              Show {{pageSize}}
            </option>
          </template>
        </select>
      </div>
      <div>
        Showing {{table.getRowModel().rows.length.toLocaleString()}} of{' '}
        {{table.getRowCount().toLocaleString()}} Rows
      </div>
      <pre>{{JSON.stringify(table.getState().pagination, null, 2)}}</pre> -->
  </div>
</template>