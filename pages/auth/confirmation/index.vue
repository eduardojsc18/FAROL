<template>
    <div>
        <div class="card">
            <div class="loader">
                <p>carregando</p>
                <div class="words">
                    <span class="word">💸 Vendas</span>
                    <span class="word">📊 Estoques</span>
                    <span class="word">💳 Finanças</span>
                    <span class="word">📉 Pesquisas</span>
                    <span class="word">🎉 Sucesso!</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const { $fetchSupabase } = useNuxtApp()

definePageMeta({
    layout: 'auth'
})

const router = useRouter()

const execCheckUserHasConnection = async () => {
    let data = {}
    try {
        data = await $fetchSupabase('/api/me/has-connection')
        await new Promise(resolve => setTimeout(resolve, 2_000))
    } catch (e) {
        console.log(e)
    } finally {
        await router.push(!!data.has_connection ? '/admin/dashboard' : '/admin/minha-conta?#conexoes')
    }
}
execCheckUserHasConnection()
</script>
<style scoped>
.loader {
    color: rgb(124, 124, 124);
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 32px;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    height: 50px;
    padding: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    border-radius: 8px;
}

.words {
    overflow: hidden;
    height: 60px;
    padding-top: 5px;
    position: relative;
}
.words::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
            #FFF 5%,
            transparent 30%,
            transparent 30%,
            transparent 30%,
            transparent 30%,
            transparent 70%,
            #FFF 90%
    );
    z-index: 20;
}

.word {
    display: block;
    height: 100%;
    padding: 0 20px;
    color: #ff9100;
    animation: spin_4991 4s infinite;
}

@keyframes spin_4991 {
    10% {
        -webkit-transform: translateY(-102%);
        transform: translateY(-102%);
    }

    25% {
        -webkit-transform: translateY(-100%);
        transform: translateY(-100%);
    }

    35% {
        -webkit-transform: translateY(-202%);
        transform: translateY(-202%);
    }

    50% {
        -webkit-transform: translateY(-200%);
        transform: translateY(-200%);
    }

    60% {
        -webkit-transform: translateY(-302%);
        transform: translateY(-302%);
    }

    75% {
        -webkit-transform: translateY(-300%);
        transform: translateY(-300%);
    }

    85% {
        -webkit-transform: translateY(-402%);
        transform: translateY(-402%);
    }

    100% {
        -webkit-transform: translateY(-400%);
        transform: translateY(-400%);
    }
}
</style>
