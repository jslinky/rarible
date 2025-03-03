<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from './ui/button/Button.vue';
import { Search, SearchX } from 'lucide-vue-next'

const smAndLarger: ComputedRef<boolean> | undefined = inject('smAndLarger');

const searchExpanded = ref(smAndLarger?.value ?? true)
const searchQuery = defineModel<string>()

const searchInputRef = ref<{ focus: () => void } | null>(null);

const focusSearch = (event: KeyboardEvent) => {
    if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
        console.log('focusSearch', searchInputRef.value)
        event.preventDefault();
        searchInputRef.value?.focus();
    }
};

const searchIcon = computed(() => searchExpanded.value && !smAndLarger ? SearchX : Search)

watch([smAndLarger], (newVal) => {
    newVal && searchExpanded.value ? searchExpanded.value = false : searchExpanded.value = true;
})

onMounted(() => {
    window.addEventListener('keydown', focusSearch);
});

onUnmounted(() => {
    window.removeEventListener('keydown', focusSearch);
});



</script>

<template>
    <div class="header-search relative w-full max-w-md items-center" v-bind="$attrs">
        <Button variant="outline" @click="searchExpanded = !searchExpanded"
            :class="[{ 'pointer-events-none': smAndLarger }, searchExpanded ? 'px-2' : 'px-4']"
            class="absolute start-1.5 inset-y-0 flex items-center justify-center z-10 bg-transparent border-0 top-1/2 -translate-y-1/2"
            :aria-expanded="searchExpanded">
            <component :is="searchIcon" :class="{ 'text-muted-foreground': smAndLarger }" class="size-4" />
        </Button variant="outline">
        <Input id="search" type="text" ref="searchInputRef" v-model="searchQuery"
            placeholder="Search collection, item & select" class="rounded-xl bg-muted"
            :class="{ 'pl-10 opacity-100': searchExpanded, 'opacity-0': !searchExpanded }" />
        <span
            class="header-search__shortcut absolute end-2 inset-y-0 flex items-center justify-center px-2 text-gray-500 dark:bg-gray-800 font-mono rounded-sm h-[calc(100%-1em)] top-[0.5em]">/</span>
    </div>
</template>

<style>
.header-search {
    &:has([aria-expanded="false"]) {
        max-width: 3rem;

        .header-search__shortcut {
            display: none;
        }
    }
}

button[aria-expanded] {
    &:focus {
        background: transparent;
    }
}

.header-search__shortcut {
    display: none;

    @media (pointer: fine) {
        display: block;
    }
}
</style>