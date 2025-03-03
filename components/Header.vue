<script setup lang="ts">

import Logo from '@/components/Logo.vue'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon, SunMoon  } from 'lucide-vue-next';

const colorMode = useColorMode()

const { timePeriods, currentPeriod } = defineProps<{
    timePeriods: timePeriod[];
    currentPeriod: timePeriod;
}>()

const smAndLarger: ComputedRef<boolean> | undefined = inject('smAndLarger');

const emit = defineEmits<{
    (e: 'generateLink', period: timePeriod): void
}>()

const searchQuery = defineModel<string>('search-query', { default: '' })
const showFavs = defineModel<boolean>('show-favs', { default: false })
const chainSelectOptions = defineModel<Ref<ChainOptions[]>>('chain-select-options', { default: [] })

const timePeriodSelectOptions = defineModel<Ref<{ value: timePeriod; label: timePeriod; disabled: boolean; }[]>>('time-period-select-options', { default: [] })

const generateLink = (period: timePeriod) => {
    emit('generateLink', period)
}

const colorIcon = computed(() => {
    switch (colorMode.value) {
        case 'system':
            return SunMoon;
        case 'dark':
            return MoonIcon;
        case 'light':
            return SunIcon;
        default:
            return SunMoon;
    }
});

</script>
<template>
    <header class="w-wrapper mx-auto sm:pl-[var(--layout-gap)]">
        <div class="flex justify-between items-center gap-x-2 sm:gap-x-4">
            <div class="flex-1">
                <Logo :fill="(colorMode.value === 'dark' || colorMode.value === 'system') ? 'hsl(var(--primary))' : 'black'" />
            </div>
            <HeaderSearch v-model="searchQuery" class="!flex-auto" />

            <div class="flex justify-end flex-grow-0 sm:flex-grow">
                <ClientOnly>
                    <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline" class="border-0">
                            <component :is="colorIcon" class="size-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-max bg-muted right-[1rem] -translate-x-[1rem] -translate-y-full">
                        <DropdownMenuRadioGroup v-model="$colorMode.preference" class="grid grid-cols-[auto] grid-flow-col *:text-xs justify-center">
                            <DropdownMenuRadioItem value="system" class="pl-2 pr-2">
                                <SunMoon class="size-4" />
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="light" class="*:first:hidden pl-2 pr-2">
                                <SunIcon class="size-4" />
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark" class="*:first:hidden pl-2 pr-2">
                                <MoonIcon class="size-4" />
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </ClientOnly>
            </div>
        </div>

        <nav class="flex mt-8 flex-wrap gap-y-[var(--layout-gap)] flex-col sm:flex-row">
            <div class="flex-auto flex items-center">
                <div class="grid grid-flow-col gap-2 auto-cols-fr max-w-max">
                    <NuxtLink @click="showFavs = false" class="font-space text-xl hover:cursor-pointer" :class="{ 'text-gray-500': showFavs }">
                        Trending</NuxtLink>
                    <NuxtLink @click="showFavs = true" class="font-space text-xl hover:cursor-pointer" :class="{ 'text-gray-500': !showFavs }">
                        Watchlist</NuxtLink>
                </div>
            </div>

            <div class="flex gap-[10px]">
                <div class="chain-select flex-auto flex justify-end min-w-[--radix-select-trigger-width]">
                    <CustomSelect 
                        v-model="chainSelectOptions"
                        :select-content-class="'custom-select-content bg-muted rounded-t-none rounded-b-[20px]'"
                        :select-trigger-class="'chain-select-trigger w-full md:max-w-[180px] rounded-t-[20px] rounded-b-[20px] bg-muted border-0 aria-expanded:border-[1px] aria-expanded:rounded-b-none'" />
                </div>
                <div class="time-period-links relative grid grid-cols-[auto] grid-flow-col bg-muted rounded-full max-w-max items-center px-1"
                    v-if="smAndLarger">
                    <template v-for="tp in timePeriods" :key="tp">
                        <!-- When clicked, the link updates the "period" query parameter -->
                        <NuxtLink @click="generateLink(tp)" class="py-1 px-4 rounded-full hover:cursor-pointer"
                            :class="{ 'dark:bg-gray-800 bg-gray-200': tp === currentPeriod }">
                            {{ tp }}
                        </NuxtLink>
                    </template>
                </div>
                <CustomSelect 
                    v-if="timePeriodSelectOptions && !smAndLarger" 
                    v-model="timePeriodSelectOptions"
                    :select-content-class="'custom-select-content bg-muted rounded-t-none rounded-b-[20px]'"
                    :select-trigger-class="'w-[180px] rounded-t-[20px] rounded-b-[20px] bg-muted border-0 aria-expanded:border-[1px] aria-expanded:rounded-b-none max-w-[6rem]'" />
            </div>


        </nav>
    </header>
</template>