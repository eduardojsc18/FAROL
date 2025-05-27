<template>
    <div class="flex !items-stretch">
        <v-menu v-if="props.showSelectPeriod">
            <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"
                    :density="$attrs.density"
                    icon="mdi-calendar-filter"
                    text="período"
                    color="gray"
                    active-color="orange-darken-4"
                    class="!h-auto !px-5"
                    variant="tonal"
                    v-tooltip:top="'Período'"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 !absolute">
                        <path d="M12 11.993a.75.75 0 0 0-.75.75v.006c0 .414.336.75.75.75h.006a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75H12ZM12 16.494a.75.75 0 0 0-.75.75v.005c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H12ZM8.999 17.244a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.006ZM7.499 16.494a.75.75 0 0 0-.75.75v.005c0 .414.336.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H7.5ZM13.499 14.997a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.005a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.005ZM14.25 16.494a.75.75 0 0 0-.75.75v.006c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75h-.005ZM15.75 14.995a.75.75 0 0 1 .75-.75h.005a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75H16.5a.75.75 0 0 1-.75-.75v-.006ZM13.498 12.743a.75.75 0 0 1 .75-.75h2.25a.75.75 0 1 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM6.748 14.993a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
                        <path fill-rule="evenodd" d="M18 2.993a.75.75 0 0 0-1.5 0v1.5h-9V2.994a.75.75 0 1 0-1.5 0v1.497h-.752a3 3 0 0 0-3 3v11.252a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V7.492a3 3 0 0 0-3-3H18V2.993ZM3.748 18.743v-7.5a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5Z" clip-rule="evenodd" />
                    </svg>
                </v-btn>
            </template>
            <v-list density="compact" class="z-[999999]">
                <v-list-item
                    v-for="(item, index) in periods" :key="index"
                    :value="item.title"
                    :title="item.title"
                    :subtitle="item.subtitle"
                    :active="form.length > 0 && dayjs(form[0]).format('YYYY-MM-DD') === dayjs(item.value[0]).format('YYYY-MM-DD') && dayjs(form[form.length-1]).format('YYYY-MM-DD') === dayjs(item.value[1]).format('YYYY-MM-DD')"
                    color="orange"
                    @click="() => form = item.value"
                />
            </v-list>
        </v-menu>
        <v-date-input
            v-model="form"
            :placeholder="attrs.multiple ? 'DD/MM/YYYY - DD/MM/YYYY' : 'DD/MM/YYYY'"
            persistent-placeholder
            color="orange-darken-1"
            prepend-icon=""
            show-adjacent-months
            cancel-text="cancelar"
            clearable
            @click:clear="form = [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]"
            v-bind="$attrs"
            :data-show-select-period="props.showSelectPeriod"
        />
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { useAttrs } from 'vue'

defineOptions({
    inheritAttrs: false,
})

const { current } = useLocale()
current.value = 'pt'

const attrs = useAttrs()
const props = defineProps({
    showSelectPeriod: {type: Boolean, default: false},
})

const form = defineModel('modelValue', {
    get: (value) => {
        if (attrs.multiple) {
            if (!!value?.length && value.length >= 2) {
                const startDate = dayjs(value[0]).startOf('day')
                const endDate = dayjs(value[1]).startOf('day')
                const newValue = []

                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
                    newValue.push(date.toDate())
                }

                return newValue ?? []
            }
            return []
        }
        return value ? dayjs(value).startOf('day').toDate() : value
    },
    set: (value) => {
        if (attrs.multiple) {
            if (!!value?.length) {
                const formattedValues = []
                if (value[0]) formattedValues.push(dayjs(value[0]).format('YYYY-MM-DD'))
                !value[1] ?
                    formattedValues.push(dayjs(value[0]).format('YYYY-MM-DD')) :
                    formattedValues.push(dayjs(value[value.length - 1]).format('YYYY-MM-DD'))

                return formattedValues ?? []
            }
            return []
        }
        return value ? dayjs(value).format('YYYY-MM-DD') : value
    }
})

const periods = [
    { title: 'Hoje', subtitle: '', value: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
    { title: 'Ontem', subtitle: '', value: [dayjs().subtract(1, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')] },
    { title: 'Anteontem', subtitle: '', value: [dayjs().subtract(2, 'days').format('YYYY-MM-DD'), dayjs().subtract(2, 'days').format('YYYY-MM-DD')] },
    { title: 'Esta Semana', subtitle: '', value: [dayjs().startOf('week').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
    { title: 'Semana passada', subtitle: '', value: [dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'), dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD')] },
    { title: 'Semana retrasada', subtitle: '', value: [dayjs().subtract(2, 'weeks').startOf('week').format('YYYY-MM-DD'), dayjs().subtract(2, 'weeks').endOf('week').format('YYYY-MM-DD')]},
    { title: 'Últimos 14 dias', subtitle: '', value: [dayjs().subtract(14, 'days').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
    { title: 'Últimos 21 dias', subtitle: '', value: [dayjs().subtract(21, 'days').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
    { title: 'Este Mês', subtitle: '', value: [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')] },
    { title: 'Mês passado', subtitle: '', value: [dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')] },
    { title: 'Mês retrasado', subtitle: '', value: [dayjs().subtract(2, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().subtract(2, 'month').endOf('month').format('YYYY-MM-DD')] },
    {
        title: 'Últimos 2 meses',
        value: [dayjs().subtract(2, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        subtitle: `Últimos ${dayjs().diff(dayjs().subtract(2, 'month'), 'day')} dias`
    },
    {
        title: 'Últimos 3 meses',
        value: [dayjs().subtract(3, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        subtitle: `Últimos ${dayjs().diff(dayjs().subtract(3, 'month'), 'day')} dias`
    },
    { title: 'Este ano', subtitle: '', value: [dayjs().startOf('year').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
    { title: 'Ano passado', subtitle: '', value: [dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'), dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')] },
];
</script>
<style scoped>
::v-deep(.v-input[data-show-select-period=true] > .v-input__control > .v-field) {
    border-radius: 0 8px 8px 0 !important;
}
::v-deep(.v-btn[type='button']) {
    border-radius: 8px 0 0 8px !important;
    border-width: 1px !important;
    border-color: #9d9d9d !important;
}
::v-deep(.v-btn:not(:hover)) {
    border-right: transparent !important;
}
::v-deep(.v-btn:hover) {
    border-right: 2px;
    border-color: #212121 !important;
}
::v-deep(.v-menu) {
    z-index: 999999 !important;
}
</style>
