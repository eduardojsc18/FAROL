<template>
    <div>
        <header class="backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50 lg:!border-transparent bg-gray-50 dark:bg-gray-950">
            <nav class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[65px]">
                <div class="lg:flex-1 flex items-center gap-1.5">
                    <Logo />
                </div>
                <ul class="items-center ring-1 ring-gray-200 whitespace-nowrap dark:ring-gray-800 px-3 gap-x-0 rounded-full hidden lg:flex">
                    <MenuItemHome href="#inicio" />
                    <MenuItem text="Sobre a plataforma" href="#sobre-a-plataforma"/>
                    <MenuItem text="Preços" href="#precos"/>
                    <MenuItem text="Avaliações" href="#avaliacoes"/>
                    <MenuItem text="Perguntas Frequentes" href="#perguntas"/>
                </ul>
                <div class="flex items-center justify-end lg:flex-1 gap-1.5">
                    <ButtonSignIn text="Entrar" />
                </div>
            </nav>
        </header>
        <main class="min-h-svh">
            <div>
                <section id="inicio" class="py-24 sm:py-32 md:py-40 relative">
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                        <div class="text-center">
                            <h1 class="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                                Acompanhe suas vendas do <b class="font-bold mx-3 text-orange-600">Mercado Livre</b> com precisão
                            </h1>
                            <div class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                                Farol oferece uma plataforma intuitiva para monitorar e analisar suas vendas no <b class="text-orange-600">Mercado Livre</b>,
                                ajudando você a tomar decisões informadas e aumentar seus lucros. <u class="underline-offset-4 font-medium">De forma simplificada!</u>
                            </div>
                            <div class="mt-10 flex items-center flex-wrap gap-x-6 gap-y-3 justify-center">
                                <!--                                <ButtonLogin text="Entrar com sua conta" variant="outline" class="!text-xl !p-5"/>-->
                                <!--                                <div class="dark:text-neutral-50">-->
                                <!--                                    ou-->
                                <!--                                </div>-->
                                <ButtonSignIn text="Entrar em sua conta" size="large"/>
                            </div>
                        </div>
                        <div class="relative">
                            <div class="bg-background dark:bg-background border-gradient rounded-xl p-4">
                                <div class="aspect-video rounded-lg relative overflow-hidden border border-dashed border-gray-950/10 dark:border-white/10">
                                    <svg class="absolute inset-0 h-full w-full stroke-gray-950/10 dark:stroke-white/10" fill="none">
                                        <defs>
                                            <pattern id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"
                                            >
                                                <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                                            </pattern>
                                        </defs>
                                        <rect stroke="none" fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)" width="100%" height="100%"></rect>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <!--                        <div class="text-center">-->
                        <!--                            <h2 class="text-lg font-semibold leading-8 text-gray-900 dark:text-white">-->
                        <!--                                Confiável pelos melhores do mundo-->
                        <!--                            </h2>-->
                        <!--                            <div class="mx-auto mt-10 flex flex-wrap items-center justify-between gap-8">-->
                        <!--                                <span class="iconify i-simple-icons:amazonaws w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>-->
                        <!--                                <span class="iconify i-simple-icons:heroku w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>-->
                        <!--                                <span class="iconify i-simple-icons:netlify w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>-->
                        <!--                                <span class="iconify i-simple-icons:vercel w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>-->
                        <!--                                <span class="iconify i-simple-icons:cloudflare w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>-->
                        <!--                            </div>-->
                        <!--                        </div>-->
                    </div>
                </section>
                <section id="sobre-a-plataforma" class="py-24 sm:py-32">
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                        <div class="text-center flex flex-col items-center">
                            <!--                            <div class="mb-2 text-base/7 font-semibold text-primary">-->
                            <!--                                Características-->
                            <!--                            </div>-->
                            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                                Por que escolher nosso serviço?
                            </h2>
                            <div class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                                É importante cuidar do paciente, ser acompanhado pelo paciente, mas ao mesmo tempo ocorre muito trabalho e dor.
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 scroll-mt-[calc(var(--header-height)+140px+128px+96px)]">
                            <div class="relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-800 flex-1 flex flex-col shadow">
                                <div class="flex-1 flex flex-col overflow-hidden rounded-xl divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity]">
                                    <div class="gap-x-8 gap-y-4 rounded-xl flex-1 flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <div class="mb-2 pointer-events-none">
                                                <span class="iconify i-heroicons:cog w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>
                                            </div>
                                            <p class="text-gray-900 dark:text-white text-base font-bold truncate">
                                                Fácil de usar
                                            </p>
                                            <div class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
                                                Isto é, exceto pelos trabalhos da nossa casa, para que não saia nenhuma grande companhia.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-800 flex-1 flex flex-col shadow">
                                <div class="flex-1 flex flex-col overflow-hidden rounded-xl divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity]">
                                    <div class="gap-x-8 gap-y-4 rounded-xl flex-1 flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <div class="mb-2 pointer-events-none">
                                                <span class="iconify i-heroicons:check w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>
                                            </div>
                                            <p class="text-gray-900 dark:text-white text-base font-bold truncate">
                                                Confiável
                                            </p>
                                            <div class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
                                                Deixe um grande incêndio escapar por um fio de cabelo;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-800 flex-1 flex flex-col shadow">
                                <div class="flex-1 flex flex-col overflow-hidden rounded-xl divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity]">
                                    <div class="gap-x-8 gap-y-4 rounded-xl flex-1 flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <div class="mb-2 pointer-events-none">
                                                <span class="iconify i-heroicons:lock-closed w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>
                                            </div>
                                            <p class="text-gray-900 dark:text-white text-base font-bold truncate">
                                                Seguro
                                            </p>
                                            <div class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
                                                Deixe-os sair de nós, exceto que a falha pode ser seguida, ou o adipiscing, não de qualquer alma.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-800 flex-1 flex flex-col shadow">
                                <div class="flex-1 flex flex-col overflow-hidden rounded-xl divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity]">
                                    <div class="gap-x-8 gap-y-4 rounded-xl flex-1 flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <div class="mb-2 pointer-events-none">
                                                <span class="iconify i-heroicons:rocket-launch w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>
                                            </div>
                                            <p class="text-gray-900 dark:text-white text-base font-bold truncate">
                                                Rápido
                                            </p>
                                            <div class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
                                                Aquele que nos censura com dor, mas foge do trabalho, também deixa algumas pessoas serem alguma coisa, mas com prazer.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-800 flex-1 flex flex-col shadow">
                                <div class="flex-1 flex flex-col overflow-hidden rounded-xl divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity]">
                                    <div class="gap-x-8 gap-y-4 rounded-xl flex-1 flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <div class="mb-2 pointer-events-none">
                                                <span class="iconify i-heroicons:currency-dollar w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>
                                            </div>
                                            <p class="text-gray-900 dark:text-white text-base font-bold truncate">
                                                Acessível
                                            </p>
                                            <div class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
                                                Ele culpa o fazendeiro por ter fugido para nascer.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-800 flex-1 flex flex-col shadow">
                                <div class="flex-1 flex flex-col overflow-hidden rounded-xl divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity]">
                                    <div class="gap-x-8 gap-y-4 rounded-xl flex-1 flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <div class="mb-2 pointer-events-none">
                                                <span class="iconify i-heroicons:chart-bar w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" aria-hidden="true"></span>
                                            </div>
                                            <p class="text-gray-900 dark:text-white text-base font-bold truncate">
                                                Escalável
                                            </p>
                                            <div class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
                                                Eles deixam o cliente e assim por diante. Pois ela fica na busca das menores responsabilidades.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="precos" class="py-24 sm:py-32">
                    <div  class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                        <div class="text-center flex flex-col items-center">
                            <!--                            <div class="mb-2 text-base/7 font-semibold text-primary">-->
                            <!--                                Preços-->
                            <!--                            </div>-->
                            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                                Um plano para cada necessidade
                            </h2>
                            <div class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                                Digamos que o fardo do trabalho é conveniente, ou que alguém economizará até um fio de cabelo.
                            </div>
                        </div>
                        <div class="flex flex-col lg:grid lg:grid-cols-3 w-full justify-center items-center gap-8 scroll-mt-[calc(var(--header-height)+140px+128px+96px)] gap-x-0">
                            <div class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative flex flex-col self-stretch w-full">
                                <PriceEmpty />
                            </div>
                            <div class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 shadow bg-white dark:bg-gray-900 relative flex flex-col self-stretch w-full ring-2 ring-orange-700 dark:ring-orange-600 lg:scale-[1.1] lg:z-10">
                                <div class="flex-1 gap-6 lg:gap-x-8 xl:gap-x-10 flex flex-col sm:p-6 p-6 lg:p-8 xl:p-10">
                                    <div>
                                        <div class="flex items-center gap-3">
                                            <p class="text-2xl text-gray-900 dark:text-white sm:text-3xl font-semibold truncate">
                                                Tester
                                            </p>
                                        </div>
                                        <div class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                                            Plano <b class="text-orange-600">gratuito</b> para testar a plataforma. Sem nenhuma mensalidade ou pegadinhas
                                        </div>
                                    </div>
                                    <div class="flex flex-row items-baseline gap-x-1">
                                        <p class="text-gray-900 dark:text-white text-2xl sm:text-4xl font-semibold">
                                            R$ 00,00
                                        </p>
                                    </div>
                                    <div class="order-last flex-1">
                                        <ul class="space-y-3 text-sm">
                                            <li v-for="item in prices" class="flex items-center gap-x-3 min-w-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4 flex-shrink-0 text-gray-600 dark:text-white">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="text-gray-600 dark:text-gray-400 truncate">
                                                    {{item}}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <ButtonSignIn text="Começar" class="w-full"/>
                                    </div>
                                </div>
                            </div>
                            <div class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative flex flex-col self-stretch w-full">
                                <PriceEmpty />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="avaliacoes" class="py-24 sm:py-32">
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                        <div class="text-center flex flex-col items-center">
                            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                                O que nossos clientes estão dizendo.
                            </h2>
                            <div class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                                Acontece que o exercício é o menor dos trabalhos do trabalho.
                            </div>
                        </div>
                        <div class="column-1 md:columns-2 lg:columns-3 gap-8 space-y-8 xl:columns-4 scroll-mt-[calc(var(--header-height)+140px+128px+96px)]" id="testimonials">
                            <div class="break-inside-avoid">
                                <div class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative">
                                    <div class="flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <q class="text-gray-600 dark:text-gray-300">
                                                Nostrud chegou a tempo de fugir. A dor na dor não é obscurecida pelo trabalho de parto, exceto por qualquer trabalho de parto. Deixe-o
                                                fugir e esteja disposto a ser perdoado, assim como ele não culpa seu desejo de prazer com nenhuma dor. Alguns dos alimentos moles são
                                                escuros.
                                            </q>
                                            <div class="flex items-center gap-3 mt-6 relative">
                                                <span class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-10 w-10 text-base">
                                                    <img class="rounded-full h-10 w-10 text-base" alt="Rosa Roberson" src="https://i.pravatar.cc/120?img=1" loading="lazy">
                                                </span>
                                                <div>
                                                    <p class="font-semibold text-gray-900 dark:text-white text-sm">
                                                        Rosa Roberson
                                                    </p>
                                                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                                                        CEO na empresa
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="break-inside-avoid">
                                <div class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative">
                                    <div class="flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <q class="text-gray-600 dark:text-gray-300">
                                                Da mesma forma, a dor não deve ser causada por nenhuma das tarefas do produto ou pela rotina de exercícios.
                                            </q>
                                            <div class="flex items-center gap-3 mt-6 relative">
                                                <span class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-10 w-10 text-base">
                                                    <img class="rounded-full h-10 w-10 text-base" alt="Chace Rodgers" src="https://i.pravatar.cc/120?img=7" loading="lazy">
                                                </span>
                                                <div>
                                                    <p class="font-semibold text-gray-900 dark:text-white text-sm">
                                                        Chace Rodgers
                                                    </p>
                                                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                                                        CEO na empresa
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="break-inside-avoid">
                                <div class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative">
                                    <div class="flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <q class="text-gray-600 dark:text-gray-300">
                                                É isso que ele quer fazer com seus deveres, a menos que eles sofram muito e deixem pouca dor. Ser incidente da nostrua de cabelo para
                                                dar quem vai trabalhar, não existe isso, não existe casa. São aqueles que procedem do prazer dos deveres do trabalho.
                                            </q>
                                            <div class="flex items-center gap-3 mt-6 relative">
                                                <span class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-10 w-10 text-base">
                                                    <img class="rounded-full h-10 w-10 text-base" alt="Cornélio Sheppard" src="https://i.pravatar.cc/120?img=3" loading="lazy">
                                                </span>
                                                <div>
                                                    <p class="font-semibold text-gray-900 dark:text-white text-sm">
                                                        Cornélio Sheppard
                                                    </p>
                                                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                                                        CEO na empresa
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="break-inside-avoid">
                                <div class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative">
                                    <div class="flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <q class="text-gray-600 dark:text-gray-300">
                                                Ele quer ser perseguido no adipismo da culpa, assim como a vantagem do futebol na dor. Ele não irá trabalhar a menos que queira fugir da
                                                dor. Alguns deles são jogadores de futebol.
                                            </q>
                                            <div class="flex items-center gap-3 mt-6 relative">
                                                <span class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-10 w-10 text-base">
                                                    <img class="rounded-full h-10 w-10 text-base" alt="Destinee Bosques" src="https://i.pravatar.cc/120?img=5" loading="lazy">
                                                </span>
                                                <div>
                                                    <p class="font-semibold text-gray-900 dark:text-white text-sm">
                                                        Destinee Bosques
                                                    </p>
                                                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                                                        CEO na empresa
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="break-inside-avoid">
                                <div class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative">
                                    <div class="flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <q class="text-gray-600 dark:text-gray-300">
                                                Sai quem sai, quem sai do exercício.
                                            </q>
                                            <div class="flex items-center gap-3 mt-6 relative">
                                                <span class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-10 w-10 text-base">
                                                    <img class="rounded-full h-10 w-10 text-base" alt="Kaleb McCormick - O que é Kaleb McCormick?" src="https://i.pravatar.cc/120?img=8"
                                                         loading="lazy">
                                                </span>
                                                <div>
                                                    <p class="font-semibold text-gray-900 dark:text-white text-sm">
                                                        Kaleb McCormick
                                                    </p>
                                                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                                                        CEO na empresa
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="break-inside-avoid">
                                <div class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative">
                                    <div class="flex flex-col px-4 py-5 sm:p-6">
                                        <div>
                                            <q class="text-gray-600 dark:text-gray-300">
                                                A grande responsabilidade de quem está nas responsabilidades não é o prazer, mas a culpa é do trabalho. Ou é um pé no saco prestar um
                                                serviço à dor de uma grande quantidade de exercícios ao longo do tempo?
                                            </q>
                                            <div class="flex items-center gap-3 mt-6 relative">
                                                <span class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-10 w-10 text-base">
                                                    <img class="rounded-full h-10 w-10 text-base" alt="Jazmin McCall" src="https://i.pravatar.cc/120?img=9" loading="lazy">
                                                </span>
                                                <div>
                                                    <p class="font-semibold text-gray-900 dark:text-white text-sm">
                                                        Jazmin McCall
                                                    </p>
                                                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                                                        CEO na empresa
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="py-24 sm:py-32 bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10">
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                        <div class="relative">
                            <div class="flex flex-col gap-16 sm:gap-y-24 sm:p-6 py-24 sm:py-32 px-6 lg:px-8">
                                <div class="text-center">
                                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                        Comece hoje mesmo
                                    </h2>
                                    <div class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                                        A testar o Farol! E não se perca na navegação
                                    </div>
                                    <div class="mt-10 flex items-center gap-x-6 justify-center">
                                        <ButtonSignIn text="ENTRAR NA PLATAFORMA"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="perguntas" class="py-24 sm:py-32">
                    <div class="py-24 sm:py-32 scroll-mt-[var(--header-height)]" id="faq">
                        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                            <div class="text-center flex flex-col items-center">
                                <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                                    Perguntas frequentes
                                </h2>
                                <div class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                                    A culpa será seguida de sofrimento e será útil por algum tempo, a menos que saiam do mercado.
                                </div>
                            </div>
                            <div class="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800 -mt-6 max-w-4xl mx-auto">
                                <div class="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                                    <button type="button"
                                            class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-none gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 hover:no-underline inline-flex items-center text-left text-lg py-6 w-full"
                                            id="headlessui-disclosure-button-v-2-0" aria-expanded="true" aria-controls="headlessui-disclosure-panel-v-2-1" data-headlessui-state="open">
                                        <span class="text-gray-900 dark:text-white font-semibold">
                                            Este é um serviço seguro?
                                        </span>
                                        <span class="iconify i-heroicons:chevron-down-20-solid ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 w-6 h-6"
                                              aria-hidden="true"></span>
                                    </button>
                                    <div>
                                        <div id="headlessui-disclosure-panel-v-2-1" data-headlessui-state="open" class="text-base text-gray-500 dark:text-gray-400 py-6">
                                            Aqueles que são nossos, alguns criticarão, pois se manifestam, e alguns serão perdoados.
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                                    <button type="button"
                                            class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-none gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 hover:no-underline inline-flex items-center text-left text-lg py-6 w-full"
                                            id="headlessui-disclosure-button-v-2-2" aria-expanded="false" data-headlessui-state="" aria-controls="headlessui-disclosure-panel-v-2-3">
                                        <span class="text-gray-900 dark:text-white font-semibold">
                                            Como posso cancelar minha assinatura?
                                        </span>
                                        <span class="iconify i-heroicons:chevron-down-20-solid ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 w-6 h-6 -rotate-90"
                                              aria-hidden="true"></span>
                                    </button>
                                    <div style="display:none;">
                                        <div id="headlessui-disclosure-panel-v-2-3" data-headlessui-state="" class="text-base text-gray-500 dark:text-gray-400 py-6">
                                            Pode-se concluir que alguns dos serviços por nós oferecidos são de grande interesse.
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                                    <button type="button"
                                            class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-none gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 hover:no-underline inline-flex items-center text-left text-lg py-6 w-full"
                                            id="headlessui-disclosure-button-v-2-4" aria-expanded="false" data-headlessui-state="" aria-controls="headlessui-disclosure-panel-v-2-5">
                                        <span class="text-gray-900 dark:text-white font-semibold">
                                            Como funciona o teste gratuito?
                                        </span>
                                        <span class="iconify i-heroicons:chevron-down-20-solid ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 w-6 h-6 -rotate-90"
                                              aria-hidden="true"></span>
                                    </button>
                                    <div style="display:none;">
                                        <div id="headlessui-disclosure-panel-v-2-5" data-headlessui-state="" class="text-base text-gray-500 dark:text-gray-400 py-6">
                                            Quais serviços são bons para você?
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                                    <button type="button"
                                            class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-none gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 hover:no-underline inline-flex items-center text-left text-lg py-6 w-full"
                                            id="headlessui-disclosure-button-v-2-6" aria-expanded="false" data-headlessui-state="" aria-controls="headlessui-disclosure-panel-v-2-7">
                                        <span class="text-gray-900 dark:text-white font-semibold">
                                            Posso mudar de plano mais tarde?
                                        </span>
                                        <span class="iconify i-heroicons:chevron-down-20-solid ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 w-6 h-6 -rotate-90"
                                              aria-hidden="true"></span>
                                    </button>
                                    <div style="display:none;">
                                        <div id="headlessui-disclosure-panel-v-2-7" data-headlessui-state="" class="text-base text-gray-500 dark:text-gray-400 py-6">
                                            A dor da queimação com qualquer dor cega a grande dor de qualquer falha no trabalho de parto.
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                                    <button type="button"
                                            class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-none gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 hover:no-underline inline-flex items-center text-left text-lg py-6 w-full"
                                            id="headlessui-disclosure-button-v-2-8" aria-expanded="false" data-headlessui-state="" aria-controls="headlessui-disclosure-panel-v-2-9">
                                        <span class="text-gray-900 dark:text-white font-semibold">
                                            Vocês oferecem reembolsos?
                                        </span>
                                        <span class="iconify i-heroicons:chevron-down-20-solid ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5 w-6 h-6 -rotate-90"
                                              aria-hidden="true"></span>
                                    </button>
                                    <div style="display:none;">
                                        <div id="headlessui-disclosure-panel-v-2-9" data-headlessui-state="" class="text-base text-gray-500 dark:text-gray-400 py-6">
                                            Duis ameniza a nostruda de prazer ameniza a dor de Lorem, vou perdoá-los desta forma.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
        <footer class="relative">
            <div class="border-t border-gray-200 dark:border-gray-800">
                <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-16">
                    <div class="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div class="flex flex-col lg:grid grid-flow-col auto-cols-fr gap-8 xl:col-span-2">
                            <div>
                                <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                    Recursos
                                </h3>
                                <ul role="list" class="mt-6 space-y-4">
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Central de ajuda
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Documentação
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Roteiro
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Registro de alterações
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                    Características
                                </h3>
                                <ul role="list" class="mt-6 space-y-4">
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Afiliados
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Portal
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Empregos
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Patrocinadores
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                    Empresa
                                </h3>
                                <ul role="list" class="mt-6 space-y-4">
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Sobre
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Preços
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Carreiras
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            Blogue
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="mt-10 xl:mt-0">
                            <form>
                                <div>
                                    <div>
                                        <div class="flex content-center items-center justify-between text-sm">
                                            <label for="v-0" class="block font-medium text-gray-700 dark:text-gray-200">
                                                Assine nossa newsletter
                                            </label>
                                        </div>
                                    </div>
                                    <div class="relative mt-3">
                                        <div class="relative max-w-sm">
                                            <input id="v-0" type="email" required placeholder="Insira seu e-mail" class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-full placeholder-gray-400 dark:placeholder-gray-500 text-base px-3.5 py-2.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 pe-12" autocomplete="off" value="">
                                            <span class="absolute inset-y-0 end-0 flex items-center px-3.5">
                                                <button type="submit" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-xs gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900 aria-disabled:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:disabled:bg-white dark:aria-disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center">
                                                    Inscrever-se
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-800">
                <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3">
                    <div class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3">
                        <button type="button" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-1.5 p-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center" aria-label="Mudar para o modo claro">
                            <span class="iconify i-heroicons:moon-20-solid flex-shrink-0 h-5 w-5" aria-hidden="true"></span>
                        </button>
                        <a class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-2 p-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center" aria-label="GitHub" href="https://github.com/nuxt-ui-pro/landing" rel="noopener noreferrer" target="_blank">
                            <span class="iconify i-simple-icons:github flex-shrink-0 h-5 w-5" aria-hidden="true"></span>
                        </a>
                    </div>
                    <div class="mt-3 lg:mt-0 lg:order-2 flex items-center justify-center"></div>
                    <div class="flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">
                            Copyright © 2024. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>
<script setup>
import Logo from "~/components/shared/Logo/Logo.vue";
import PriceEmpty from "~/components/LandingPage/Price/PriceEmpty.vue";
import MenuItemHome from "~/components/LandingPage/Menu/MenuItemHome.vue";
import ButtonSignIn from "~/components/LandingPage/Button/ButtonSignIn.vue";
import MenuItem from "~/components/LandingPage/Menu/MenuItem.vue";

const route = useRoute()

const prices = ref(['Acesso gratuito a plataforma', 'Consulta de pedidos', 'Consulta de produtos', 'Conferencia de estoque', 'Pesquisa de Mercado'])
</script>
