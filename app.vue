<script setup lang="ts">

import type { Table } from '@tanstack/vue-table'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { columns } from '~/components/columns'
import DataTable from '~/components/DataTable.vue'
import useNftCollectionsPeriod from '~/composables/useNftCollections';

type NFTCollectionWithThumb = NFTCollection & { thumb: string };

type TData = NFTCollectionWithThumb;

type TableInstance = {
  table: Table<TData> | null
}

const route = useRoute()
const router = useRouter();
const { timePeriods, currentPeriod } = useNftCollectionsPeriod()

const table: Ref<TableInstance | null> = ref(null) // Template ref for the table component
const showFavs = ref(false) // Controls whether only favorites are shown

// Responsive breakpoints for Tailwind using VueUse
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 768 })
const smAndLarger = breakpoints.greaterOrEqual('sm')

provide('breakpoints', breakpoints);
provide('smAndLarger', smAndLarger);

// Cache key for fetching data based on the current time period
const cacheKey = computed(() => `${currentPeriod.value}`)

// Determines which chain filter is currently active
const activeFilteredChain = computed(() => route.query.chain === 'all' ? [] : route.query.chain)

const searchQuery = ref('') // Stores the search input

// Fetch NFT collections data from the API based on the current period
const { data, status, error } = useFetch<NFTCollectionData>(
  () => `/api/collections/${currentPeriod.value}`,
  { key: cacheKey.value, watch: [currentPeriod], lazy: true }
)

// Extract collections from API response
const collections = computed(() => data.value?.collections)

// Attach a thumbnail to each collection
const collectionsWithThumbsAttached = computed<NFTCollectionWithThumb[]>(() => {
  let index = 0;
  return Object.entries(collections.value ?? {}).reduce<NFTCollectionWithThumb[]>((acc, [key, value]) => {
    const newValue: NFTCollectionWithThumb = { ...value, thumb: `/img/thumbs/thumb${index + 1}.png` };
    index = index < 9 ? index + 1 : 0;
    acc.push(newValue);
    return acc;
  }, []);
});

// List of blockchain options for filtering collections
const chainOptions: Ref<ChainOptions[]> = ref([
  { value: 'all', label: 'All Chains' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'ton', label: 'TON' },
  { value: 'aptos', label: 'Aptos' },
  { value: 'base', label: 'Base' },
  { value: 'celo', label: 'Celo' },
  { value: 'kroma', label: 'Kroma' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'moonbeam', label: 'Moonbeam' },
  { value: 'palm', label: 'Palm' },
  { value: 'lisk', label: 'Lisk' },
  { value: 'rari_chain', label: 'RARI Chain' },
  { value: 'immutablex', label: 'ImmutableX' },
  { value: 'xai', label: 'XAI' },
  { value: 'mantle', label: 'Mantle' },
  { value: 'sei', label: 'Sei' },
  { value: 'bera', label: 'Bera' },
])

// Filters available chains based on fetched collections
const setAvailableChains = computed(() => {
  return chainOptions.value.map(element => {
    return {
      ...element,
      disabled: !collections.value?.find(collection => collection.chain === element.label || element.value === 'all')
    }
  });
})

// Generates options for time period selection
const setTimePeriodSelectOptions = computed(() => {
  return timePeriods.map(element => {
    return {
      value: element,
      label: element,
      disabled: false
    }
  })
})

// Stores the selected chain filter
const chainSelectOptions = ref({
  selected: route.query.chain || '',
  options: setAvailableChains.value
})

// Stores the selected time period filter
const timePeriodSelectOptions = ref({
  selected: route.query.period || '1h',
  options: setTimePeriodSelectOptions.value
})

// Function to update the selected time period in the route
const generateLink = (tp: string) => {
  timePeriodSelectOptions.value.selected = tp;
  router.replace({ query: { ...route.query, period: timePeriodSelectOptions.value.selected } });
}

// Filters collections to show only favorited items
const collectionsFilteredByFavs = computed(() => {
  const favs = useFavs().value; // Get favorite items
  const favNames = new Set(favs.map(fav => fav.name)); // Convert to Set for quick lookup
  return collectionsWithThumbsAttached.value.filter(collection => favNames.has(collection.name));
});

// Controls visibility of certain table columns based on screen size
const visibleCols = computed(() => {
  return {
    chain: false,
    fav: smAndLarger.value
  }
})

// Determines which data should be displayed in the table
const displayedData = computed(() => {
  return showFavs.value ? collectionsFilteredByFavs.value : collectionsWithThumbsAttached.value
})

// Watches for changes in selected filters and updates the route
watchEffect(() => {
  if (chainSelectOptions.value.selected && route.query.chain !== chainSelectOptions.value.selected) {
    router.replace({ query: { ...route.query, chain: chainSelectOptions.value.selected } });
  }
  if (timePeriodSelectOptions.value.selected && route.query.period !== timePeriodSelectOptions.value.selected) {
    router.replace({ query: { ...route.query, period: timePeriodSelectOptions.value.selected } });
  }

  // Apply global filters to the table when filters change
  if (table?.value?.table) {
    nextTick(() => {
      if (table.value?.table) {
        table.value.table.setGlobalFilter(activeFilteredChain.value);
      }
    })
  }

  // Apply search filter to the table
  if (searchQuery.value && table?.value?.table) {
    nextTick(() => {
      if (table.value?.table) {
        table.value.table.setGlobalFilter(searchQuery.value);
      }
    })
  }

}, { flush: 'post' })

// Watches column visibility settings and updates the table accordingly
watch(visibleCols, (newCols) => {
  if (table.value?.table) {
    nextTick(() => {
      if (table.value?.table) {
        table.value.table.setColumnVisibility(newCols);
      }
    });
  }
}, { deep: true });

// Runs when the component is mounted to ensure table filters are applied
onMounted(() => {
  if (table?.value?.table) {
    table.value.table.setGlobalFilter(activeFilteredChain.value)
  }
})

</script>

<template>

  <Header :timePeriods="timePeriods" :currentPeriod="currentPeriod"
    v-model:search-query="searchQuery" v-model:show-favs="showFavs" v-model:chain-select-options="chainSelectOptions"
    v-model:time-period-select-options="timePeriodSelectOptions"
    @generate-link="(payload: string) => generateLink(payload)" />

  <main class="contents">
    <div class="contents">
      <transition name="fade">
        <div v-if="status === 'pending'" class="flex items-center justify-center h-[300px] absolute">
          <span class="text-gray-500">Loading...</span>
        </div>
        <div v-else-if="error" class="text-red-500 text-center">Error: {{ error.message }}</div>
        <DataTable v-else class="data-table sm:border rounded-md w-wrapper mx-auto" ref="table" :columns="columns()"
          :data="displayedData || []" :visible-columns="visibleCols" />
      </transition>
    </div>
  </main>
  
</template>

<style lang="scss">
@layer site {

  :root {
    --layout-gap: 1rem;
    --header-height: 168px;
    --max-screen-width: 2000px;
    --radix-select-trigger-width: 180px;
    @media (min-width: 720px) {
      --header-height: 124px;
    }
  }

  html,
  body {
    height: max(100%, 100dvh);
    overflow: hidden;
  }


  body {
    display: grid;
    grid-template-rows: var(--header-height) 1fr;
  }

  header {
    > div:first-of-type {
      padding-top: calc(var(--layout-gap) * 0.75);
    }
  }

  main {
    overflow: hidden;
  }

  .clip-star {
    clip-path: polygon(50% 0, 79% 90%, 2% 35%, 98% 35%, 21% 90%);
  }

  .data-table {
    margin-top: var(--layout-gap);
    height: calc(100dvh - (var(--header-height) + (var(--layout-gap) * 2)));
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr;

    >div {
      height: 100%;
    }
  }

  .js-plotly-plot {
    width: min(80px, 100%) !important;
    margin-inline: auto 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.125s ease-in-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .chain-select-trigger > span {
    display: flex;
    align-items: center;
  }

  .chain-select-trigger > span:before, .custom-select-content div[role="option"]:before {
      display: inline-block;
      content: '';
      width: 1.2em;
      height: 1.2em;
      // background-color: #000;
      margin-right: 0.5em;
      background-size: contain;
      background-repeat: no-repeat;
      border-radius: 50%;
  }

  .custom-select-content {
    div[role="option"] {
      padding-inline: 1em !important;

      >span {
        &:first-of-type {
          position: relative !important;
          order: 3;
        }

        &:last-of-type {
          flex: 1 1 auto;
        }
      }
    }
  }

  .thumbnail {
    --stamp-size: 0.375rem;

    img {
      mask: radial-gradient(circle at bottom right, transparent calc(var(--stamp-size) + 2px), red calc(var(--stamp-size) + 2px));
    }

    div {
      width: calc(var(--stamp-size)*2);
      height: calc(var(--stamp-size)*2);
      transform: translate(50%, 50%);
      background-size: cover;
    }
  }


  $chains: (
    'all',
    'ethereum',
    'ton',
    'polygon',
    'aptos',
    'base',
    'celo',
    'kroma',
    'arbitrum',
    'moonbeam',
    'palm',
    'lisk',
    'rari_chain',
    'immutablex',
    'xai',
    'mantle',
    'sei',
    'bera'
  );

.chain-select-trigger > span:before, [data-select-value]:before, [data-chain-type] {
  background-image: var(--img);
}

@each $chain in $chains {
  
  :is(.chain-select:has([default-value="#{$chain}"]), [data-select-value="#{$chain}"], [data-chain-type="#{$chain}"]) {
    --img: url("../img/coins/#{$chain}.png");
  }

}

td:first-child,
th:first-child {
  border-radius: 10px 0 0 10px;
}

td:last-child,
th:last-child {
  border-radius: 0 10px 10px 0;
}

[data-radix-popper-content-wrapper] {
  >div {
    --tw-translate-y: 0 !important;
  }
}

}
</style>