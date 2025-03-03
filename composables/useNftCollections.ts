export default function useNftCollectionsPeriod() {
    const route = useRoute()
    const timePeriods: timePeriod[] = ['1h', '6h', '24h', '7d', '30d']
    const currentPeriod = computed(() => timePeriods.indexOf(route.query.period as timePeriod) === -1 ? '1h' : route.query.period as timePeriod)
    return {
        timePeriods,
        currentPeriod,
        nftCollectionsPeriod: useState<timePeriod>('nftCollectionsPeriod', () => currentPeriod),
    } 
  }