// import type { NuxtApp } from '@nuxt/types'

export type FavItem = {
    id: string
    name: string
}

export const useFavs = () => useCookie<FavItem[]>('nftFavs', { default: () => [], watch: true })

export const isFav = (id: string, name:string) => useFavs().value.some(item => item.id === id && item.name === name)
// export const toggleFav = (item: FavItem) => isFav(item.id, item.name) ? removeFav(item.id) : addFav(item)

export const toggleFav = (item: FavItem) => {
    if (useFavs().value.some(fav => fav.name === item.name)) {
        useFavs().value = useFavs().value.filter(fav => fav.name !== item.name);
    } else {
        useFavs().value.push(item);
    }
};

export const addFav = (item: FavItem) => useFavs().value.push(item)
export const removeFav = (id: string) => useFavs().value = useFavs().value.filter(item => item.id !== id)