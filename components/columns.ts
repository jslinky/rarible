import { h } from 'vue'
import PlotlyChart from '~/components/PlotlyChart.vue';
import Button from './ui/button/Button.vue';
import { ArrowUpDown, Star, ChevronDown, ChevronUp  } from 'lucide-vue-next'
import useNftCollectionsPeriod from '~/composables/useNftCollections';
import useChart from '~/composables/useChart';
import { toggleFav, type FavItem } from '~/composables/useNftFav';

import type { ColumnDef } from '@tanstack/vue-table'

type T = NFTCollection | NFTCollection & { thumb: string }

export const columns: () => ColumnDef<T>[] = () => {

  const { currentPeriod } = useNftCollectionsPeriod()

  const createHeader = (label: string, sortable = false, includeTimePeriod: boolean = false) => {
    return ({ column }: { column: any }) => {
      const heading = includeTimePeriod ? `${label} ${currentPeriod.value}` : label
      return h(
        'div',
        { class: 'grid transition-[grid-columns] grid-cols-[auto_calc(var(--selected,0)*20px)] hover:[--selected:1] hover:[&:nth-child(2)]:px-1 items-center justify-end space-x-2' },
        [
          h('span', { class: 'select-none'}, heading),
          sortable &&
            h(
              Button,
              {
                variant: 'link',
                size: 'sm',
                class: 'flex items-center justify-center p-0 overflow-hidden text-gray-500',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
              },
              () => h(ArrowUpDown, { class: 'h-4 w-4' })
            ),
        ]
      )
    }
  }

  return [  
    {
      accessorKey: 'fav',
      header: () => h('div', { class: 'text-left' }, ''),
      cell: ({ row }) => {

        const favs = useFavs();
        const item: FavItem = { id: row.id, name: row.getValue('name') };
        const isFav = computed(() => favs.value.some(fav => fav.name === item.name));        

        return h(Button, { 
          variant: 'ghost',
          size: 'sm',
          class: isFav.value ? 'text-yellow-400' : 'text-gray-700',
          onClick: () => toggleFav(item),
        }, () => h(Star, { class: 'h-4 w-4 fill-current' }));
      },
    },    
    {
      accessorKey: 'thumb',
      header: () => h('div', { class: 'text-left' }, ''),
      cell: ({ row }) => {
        const chain = (row.getValue('chain') ?? "") as string;
        return h('div', { class: 'thumbnail grid grid-cols-1 grid-rows-1 *:col-span-full *:row-span-full' }, [
          h('img', { 
            class: 'w-8 h-8 object-cover rounded', 
            src: row.getValue('thumb') ?? '/img/thumbs/thumb1.png', 
            alt: 'NFT Thumbnail' 
          }), h('div', { 'data-chain-type': chain.toLowerCase(), class: 'bg-gray-700 inline-block rounded-full mt-auto ml-auto z-10' })]);
      },
    },    
    {
      accessorKey: 'name',
      header: createHeader(`Name`, true, false),
      cell: ({ row }) => {  
        return h('div', { class: 'text-left flex items-center gap-2' }, [
          h('span', { class: '' }, row.getValue('name')),
          h("svg", { 
            width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", class: 'w-[1em] h-[1em] inline-block' 
          }, [
            h("path", {
              d: "M1.62226 9.04447C1.62165 9.52343 1.73686 9.8779 1.96788 10.108C2.19828 10.3386 2.54787 10.4521 3.01663 10.4484H4.05988C4.10346 10.4468 4.14693 10.4541 4.1876 10.4698C4.22828 10.4856 4.26531 10.5095 4.2964 10.5401L5.03897 11.2742C5.37633 11.6113 5.70696 11.7789 6.03086 11.7771C6.35478 11.7753 6.68542 11.6077 7.02278 11.2742L7.75622 10.5401C7.78838 10.5092 7.82646 10.485 7.86822 10.4693C7.90998 10.4535 7.95454 10.4464 7.9991 10.4484H9.03598C9.50958 10.449 9.86254 10.3337 10.0948 10.1025C10.327 9.87119 10.4432 9.51671 10.4432 9.03895V8.0011C10.4408 7.91118 10.4737 7.8239 10.5349 7.75791L11.2682 7.02383C11.6099 6.68798 11.7795 6.35734 11.777 6.0319C11.7746 5.70642 11.605 5.37546 11.2682 5.03901L10.5349 4.3049C10.4735 4.23907 10.4406 4.1517 10.4432 4.06174V3.0239C10.4425 2.54551 10.3273 2.19101 10.0976 1.96038C9.86774 1.72975 9.5139 1.61443 9.03598 1.61443H7.9991C7.95454 1.61627 7.91006 1.60909 7.8683 1.59333C7.82662 1.57756 7.78846 1.55353 7.75622 1.52267L7.02278 0.788576C6.68542 0.451496 6.35478 0.283881 6.03086 0.285721C5.70696 0.287553 5.37633 0.455168 5.03897 0.788576L4.2964 1.52267C4.26521 1.55317 4.22819 1.57702 4.18753 1.59279C4.14688 1.60856 4.10344 1.61593 4.05988 1.61443H3.01663C2.54359 1.61505 2.19186 1.72944 1.96145 1.95762C1.73104 2.18581 1.61584 2.54123 1.61584 3.0239V4.06449C1.61841 4.15446 1.58548 4.24182 1.52416 4.30766L0.790772 5.04176C0.45402 5.37761 0.285645 5.70856 0.285645 6.03462C0.285645 6.3607 0.456164 6.69222 0.797196 7.02935L1.53059 7.76342C1.59173 7.82934 1.62464 7.91662 1.62226 8.00662V9.04447Z",
              fill: "#FAFF00"
            }),
            h("path", {
              d: "M5.99775 7.9954C5.8895 8.16036 5.7297 8.25308 5.54411 8.25308C5.35338 8.25308 5.20389 8.1758 5.0647 7.9954L3.84814 6.51076C3.76051 6.40252 3.71411 6.28908 3.71411 6.1654C3.71411 5.90763 3.91 5.70658 4.16259 5.70658C4.31724 5.70658 4.44096 5.76328 4.56468 5.92309L5.52349 7.14484L7.55969 3.87658C7.66793 3.70132 7.80714 3.61884 7.96178 3.61884C8.2041 3.61884 8.4309 3.78895 8.4309 4.04154C8.4309 4.1601 8.36905 4.28382 8.30201 4.39208L5.99775 7.9954Z",
              fill: "#0A0A0A"
            })
          ])
      ]);        
      },
    },
    {
      accessorKey: 'chain',
      header: () => h('div', { class: 'text-right' }, 'Chain'),
      cell: ({ row }) => {
        return h('div', { class: 'text-right' }, row.getValue('chain'))
      },
    },
    {
      accessorKey: 'floor_price',
      header: createHeader(`Floor`, true, true),
      cell: ({ row }) => {
        const output = row.getValue('floor_price') as string
        let [price, coin] = output.split(' ')
        coin = 'ETH'
        return h('div', { class: 'text-right' }, [
          h('span', { class: 'text-white' }, price),
          h('span', { class: 'text-gray-400 ml-1' }, coin)
        ])
      },
    },
    {
      accessorKey: 'floor_change',
      header: createHeader(`FL. Ch`, true, true),
      cell: ({ row }) => {
        const floorChart = row.getValue('floor_chart') as number[]
        const chart = useChart(floorChart, `${currentPeriod.value}`);
        const { tradingDirection } = chart;
        return h('div', 
          { class: 'text-right', 
            style: { 
              color: tradingDirection.value.color 
            } 
          }, 
          h('div', 
            { 
              class: 'flex items-center justify-end' 
            }, 
            h('div', {
              class: 'flex items-center justify-end gap-x-2'
            }, [tradingDirection.value.direction === 'up' ? h(ChevronUp, { class: 'w-3 h-3', style: { color: tradingDirection.value.color } }) : h(ChevronDown, { class: 'w-3 h-3', style: { color: tradingDirection.value.color } }), h('div', row.getValue('floor_change'))]
          )
        )
      )                    
      },
    },
    {
      accessorKey: 'top_offer',
      header: () => h('div', { class: 'text-right' }, 'Top Offer'),
      cell: ({ row }) => {
        const output = row.getValue('floor_price') as string
        let [price, coin] = output.split(' ')        
        coin = 'ETH'
        return h('div', { class: 'text-right' }, [
          h('span', { class: 'text-white' }, price),
          h('span', { class: 'text-gray-400 ml-1' }, coin)
        ])
      },
    },
    {
        accessorKey: 'sales',
        header: createHeader(`Sales`, true, true),
        cell: ({ row }) => {
          return h('div', { class: 'text-right' }, row.getValue('sales'))
        },
    },
    {
        accessorKey: 'owners',
        header: createHeader(`Owners`, true),
        cell: ({ row }) => {
          return h('div', { class: 'text-right' }, row.getValue('owners'))
        },
    },
    {
        accessorKey: 'listed',
        header: createHeader(`Listed`, true),
        cell: ({ row }) => {
          return h('div', { class: 'text-right' }, row.getValue('listed'))
        },
    },
    {
        accessorKey: 'volume',
        header: createHeader(`Volume`, true, true),
        cell: ({ row }) => {
          const output = row.getValue('floor_price') as string
          let [volume, coin] = output.split(' ')          
          coin = 'ETH'
          return h('div', { class: 'text-right' }, [
            h('span', { class: 'text-white' }, volume),
            h('span', { class: 'text-gray-400 ml-1' }, coin)
        ]);
        },
    },
    {
        accessorKey: 'floor_chart',
        header: createHeader(`Floor`, false, true),
        cell: ({ row }) => {

          const rowData = row.getValue('floor_chart') as number[];

          return h(PlotlyChart, {
            data: rowData
          })
         
        },
    }                      
  ]
} 