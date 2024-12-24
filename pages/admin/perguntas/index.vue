<template>
    <div class="space-y-10">
        <HeaderPage
            title="Perguntas"
            :description="`Ultimas perguntas  realizadas`"
        >
            <template #icon>
                <IconQuestion />
            </template>
        </HeaderPage>
        <QuestionTable>
            <QuestionTableItem v-for="(question, index) in questions.questions" :key="index" :question="question"/>
        </QuestionTable>
    </div>
</template>
<script setup>
import {useHelpers} from "~/composables/useHelpers.js";
import {useMe} from "~/stores/useMe.js";
import HeaderPage from "~/components/ui/Layout/Admin/Header/HeaderPage.vue";
import {useDayjs} from "#dayjs";
import QuestionTable from "~/components/Admin/question/QuestionTable.vue";
import QuestionTableItem from "~/components/Admin/question/QuestionTableItem.vue";
import IconQuestion from "~/components/Admin/shared/icons/IconQuestion.vue";

const dayjs = useDayjs()
const { customFetch } = useHelpers()
const { me } = useMe()

const {data: questions} = await useAsyncData(
    'questions',
    () => customFetch('questions/search', {
        query: {
            seller: me.id,
            sort_fields: 'date_created',
            sort_types: 'DESC'
        }
    })
)
</script>
<style scoped>

</style>
