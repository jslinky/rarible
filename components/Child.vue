<script setup lang="ts">

type Props = {
    name?: string,
    lastName?: string
};

const props = defineProps<Props>() 

const { name = 'Justin', lastName = 'Small' } = props

const emit = defineEmits<{
  (e: 'changeName', value: string): void
}>()

type Model = {
    name: string;
    lastName: string;
};

const model = defineModel<Model>('name-update', { default: { name: 'Justin', lastName: 'Small' } })

const changeName = (newName: string) => {
    emit('changeName', newName)
}

</script>

<template>
    <div>
        <h1>Child Component</h1>
        <p>Name: {{ name }}</p>
        <p>Age: {{ lastName }}</p>
        <button @click="changeName('John Doe')">Change Full Name</button>
        <p>{{ model }}</p>
    </div>
</template>

