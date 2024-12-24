<template>
    CU
</template>
<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

useSeoMeta({
    title: 'Login'
})

const fields = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email'
}, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password'
}]

const validate = (state: any) => {
    const errors = []
    if (!state.email) errors.push({path: 'email', message: 'Email is required'})
    if (!state.password) errors.push({path: 'password', message: 'Password is required'})
    return errors
}

const providers = [{
    label: 'Continue with GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    click: () => {
        console.log('Redirect to GitHub')
    }
}]

function onSubmit(data: any) {
    console.log('Submitted', data)
}
</script>
