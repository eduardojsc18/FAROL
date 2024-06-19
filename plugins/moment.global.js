import moment from 'moment-timezone'

export default defineNuxtPlugin(() => {
    moment.locale('pt-br')
    moment.tz.setDefault('pt_BR')
    return {
        provide: {
            moment,
        },
    }
})
