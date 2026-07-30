export type Lang = 'ru' | 'en'

export const content = {
  ru: {
    nav: {
      features: 'возможности',
      weapons: 'оружие',
      predict: 'предикт',
      tech: 'под капотом',
      visuals: 'визуал',
      clantag: 'клантег',
      cta: 'получить',
    },
    hero: {
      tag: 'resolver для gamesense',
      title: 'violencia',
      titleAccent: 'resolver',
      lead: 'Гибкая система предикта и коррекции противников с отдельными настройками под основные группы оружия. Скрипт точнее отслеживает положение цели, адаптируется к её движениям и сам применяет параметры для оружия в руках.',
      primary: 'получить доступ',
      secondary: 'смотреть возможности',
      stats: [
        { value: '6', label: 'оружейных профилей' },
        { value: '6', label: 'целевых хитбоксов' },
        { value: '5', label: 'профилей пинга' },
      ],
      panelAlt:
        'Меню violencia resolver в gamesense: weapon group ssg 08, target hitboxes head chest stomach, ping preset auto real ping, advanced predictors jitterfix и flickfix, baim hp threshold 80hp, visual indicators, tracer origin bottom-center и clantag static',
    },
    features: {
      eyebrow: 'что внутри',
      title: 'основные возможности',
      lead: 'Каждый блок настраивается отдельно и работает без ручного переключения во время раунда.',
      items: [
        {
          title: 'раздельные профили оружия',
          text: 'Для каждой группы оружия свои параметры. Нужный профиль применяется автоматически при смене оружия в руках.',
        },
        {
          title: 'выбор целевых хитбоксов',
          text: 'Отдельно выбираются зоны, для которых считается предикт: голова, грудь, живот, руки, ноги, ступни.',
        },
        {
          title: 'компенсация задержки',
          text: 'Готовые профили под разный пинг, включая автоматическое определение реального пинга и режим нестабильного соединения.',
        },
        {
          title: 'baim if lethal',
          text: 'Принудительный body aim включается сам, когда здоровье цели опускается ниже заданного порога.',
        },
        {
          title: 'визуальные индикаторы',
          text: 'Предикт, реальная позиция и трассер выводятся на экран с настраиваемыми цветами.',
        },
        {
          title: 'clantag',
          text: 'Статичный клантег violencia.top или плавная прокрутка названия по кругу.',
        },
      ],
    },
    weapons: {
      eyebrow: 'профили',
      title: 'раздельные профили оружия',
      lead: 'Профиль применяется автоматически при смене оружия. Для каждой группы задаётся свой порог здоровья для body aim.',
      list: [
        { name: 'g3sg1 / scar-20', role: 'autosniper' },
        { name: 'ssg 08', role: 'scout' },
        { name: 'awp', role: 'sniper' },
        { name: 'r8 revolver', role: 'revolver' },
        { name: 'desert eagle', role: 'deagle' },
        { name: 'pistol', role: 'pistols' },
      ],
      hitboxTitle: 'целевые хитбоксы',
      hitboxes: ['голова', 'грудь', 'живот', 'руки', 'ноги', 'ступни'],
      pingTitle: 'компенсация задержки',
      pings: [
        'автоматическое определение реального пинга',
        'низкий пинг',
        'средний пинг',
        'высокий пинг',
        'нестабильное соединение',
      ],
    },
    predict: {
      eyebrow: 'ядро',
      title: 'продвинутый предикт',
      lead: 'Три механизма работают вместе и покрывают разные типы движения цели.',
      items: [
        {
          name: 'extra prediction',
          text: 'Учитывает дополнительное перемещение цели и точнее рассчитывает её будущую позицию.',
        },
        {
          name: 'jitterfix',
          text: 'Определяет резкие смены угла и стабилизирует расчёт против целей с jitter-движениями.',
        },
        {
          name: 'flickfix',
          text: 'Реагирует на быстрые defensive flick-движения и корректирует предикт в момент резкой смены угла.',
        },
      ],
      baimTitle: 'baim if lethal',
      baimText: 'Функция включает принудительный body aim, когда здоровье цели опускается ниже заданного значения. После смерти цели временные настройки полностью снимаются.',
      baimSteps: [
        'force safe point возвращается в режим on hotkey',
        'head удаляется из avoid unsafe hitboxes',
        'принудительный body aim отключается',
      ],
    },
    tech: {
      eyebrow: 'под капотом',
      title: 'как это считается',
      lead: 'Резолвер работает на реальных данных сетевого канала, а не на догадках по кадрам.',
      items: [
        {
          name: 'smart target selection',
          text: 'Если ближайший враг за стеной, цель берётся среди тех, кому реально можно нанести урон, и уже среди них выбирается ближайшая к перекрестью. Поиск троттлится и пересчитывается раз в 4 тика.',
        },
        {
          name: 'multi-hitbox 3d halos',
          text: 'Нимбы строятся вокруг выбранных хитбоксов с кешированием таблиц и адаптивной детализацией: 16 сегментов для близких целей и 10 для дальних.',
        },
        {
          name: 'корректная модель задержки',
          text: 'Для экстраполяции используется one-way latency, а не RTT из таблицы счёта: пинг скорборда делится на два, поэтому задержка не учитывается дважды.',
        },
        {
          name: 'circular mean по yaw',
          text: 'Средний угол считается через atan2 от суммы синусов и косинусов, поэтому переход через ±180° обрабатывается корректно. История — 6 сэмплов, минимум 3 для анализа.',
        },
        {
          name: 'simtime-gating',
          text: 'Yaw записывается только при реальном сетевом обновлении, а не каждый кадр. Это убирает ��ожные срабатывания детекции jitter и flick.',
        },
        {
          name: 'полная очистка',
          text: 'Временные изменения снимаются на shutdown и в начале раунда, а элементы меню показываются только при включённых зависимостях.',
        },
      ],
      specTitle: 'параметры по умолчанию',
      specs: [
        { k: 'jitter threshold', v: '20°' },
        { k: 'flick yaw threshold', v: '70°' },
        { k: 'extra prediction', v: '14 тиков' },
        { k: 'halo segments', v: '16 / 10' },
        { k: 'lod distance', v: '2500 units' },
        { k: 'target cache', v: '4 тика' },
      ],
      formulaTitle: 'экстраполяция',
      formulas: [
        'total_time = latency + (1 + extra_ticks) × tickinterval',
        'predict = hitbox + velocity × total_time',
        'predict_z = z + vz × t − 0.5 × gravity × t²',
      ],
      formulaNote: 'В воздухе позиция дополнительно корректируется на гравитацию, поэтому нимб не уезжает выше цели при прыжках.',
    },
    visuals: {
      eyebrow: 'на экране',
      title: 'визуальные индикаторы',
      lead: 'Видно, что именно считает резолвер, и можно сравнить расчёт с реальным положением цели.',
      items: [
        {
          name: 'draw predict',
          text: 'Показывает рассчитанную будущую позицию цели.',
        },
        {
          name: 'draw real position',
          text: 'Отображает реальное положение цели для удобного сравнения.',
        },
        {
          name: 'show ping under crosshair',
          text: 'Выводит текущую задержку рядом с прицелом.',
        },
      ],
      colorsTitle: 'настройка цветов',
      colors: ['предикт', 'реальная позиция', 'трассер'],
      tracerTitle: 'точка начала трассера',
      tracers: ['центр экрана', 'нижняя часть экрана', 'верхняя часть экрана'],
    },
    clantag: {
      eyebrow: 'clantag',
      title: 'static и loop',
      staticLabel: 'static',
      staticText: 'Постоянно отображает violencia.top.',
      loopLabel: 'loop',
      loopText: 'Плавно прокручивает название по кругу, создавая анимированный клантег.',
    },
    ui: {
      eyebrow: 'интерфейс',
      title: 'единый стиль меню',
      text: 'Все элементы выполнены в едином стиле и используют названия в нижнем регистре. Глобальный переключатель плавно переливается от алого красного до снежно-белого.',
      toggleLabel: 'violencia resolver',
    },
    cta: {
      title: 'один резолвер, всё меню',
      text: 'Раздельные оружейные профили, адаптивный предикт, коррекция сложных движений, автоматический body aim и визуальные инструменты в одном компактном меню.',
      primary: 'скачать violencianightly.lua',
      secondary: 'написать в telegram',
      fileTitle: 'violencianightly.lua',
      fileMeta: 'lua • gamesense',
      fileSteps: [
        'скачай violencianightly.lua и положи его в папку lua',
        'загрузи скрипт в script manager внутри gamesense',
        'включи violencia resolver в rage → other',
      ],
      contactTitle: 'контакты',
      contactText: 'Вопросы по настройке и доступу — напрямую в telegram.',
      contactHandle: 't.me/qirel',
      newsTitle: 'новости',
      newsText: 'Обновления скрипта и changelog выходят в канале.',
      newsHandle: 't.me/violencialua',
    },
    footer: {
      note: 'Скрипт для gamesense. Не связан с Valve Corporation.',
      rights: 'Все права защищены.',
      contactLabel: 'связь',
      newsLabel: 'новости',
    },
  },
  en: {
    nav: {
      features: 'features',
      weapons: 'weapons',
      predict: 'prediction',
      tech: 'under the hood',
      visuals: 'visuals',
      clantag: 'clantag',
      cta: 'get access',
    },
    hero: {
      tag: 'resolver for gamesense',
      title: 'violencia',
      titleAccent: 'resolver',
      lead: 'A flexible prediction and correction system with separate settings for every main weapon group. The script tracks enemy position more precisely, adapts to their movement and applies the right parameters for the weapon in hand.',
      primary: 'get access',
      secondary: 'see features',
      stats: [
        { value: '6', label: 'weapon profiles' },
        { value: '6', label: 'target hitboxes' },
        { value: '5', label: 'ping profiles' },
      ],
      panelAlt:
        'violencia resolver menu in gamesense: weapon group ssg 08, target hitboxes head chest stomach, ping preset auto real ping, advanced predictors jitterfix and flickfix, baim hp threshold 80hp, visual indicators, tracer origin bottom-center and clantag static',
    },
    features: {
      eyebrow: 'what is inside',
      title: 'core features',
      lead: 'Every block is configured separately and works without manual switching during the round.',
      items: [
        {
          title: 'separate weapon profiles',
          text: 'Each weapon group keeps its own parameters. The matching profile is applied automatically when you switch weapons.',
        },
        {
          title: 'target hitbox selection',
          text: 'Pick the zones prediction is calculated for: head, chest, stomach, arms, legs, feet.',
        },
        {
          title: 'latency compensation',
          text: 'Ready profiles for different ping, including automatic real ping detection and an unstable connection mode.',
        },
        {
          title: 'baim if lethal',
          text: 'Forced body aim turns on by itself once enemy health drops below the threshold you set.',
        },
        {
          title: 'visual indicators',
          text: 'Prediction, real position and tracer are drawn on screen with configurable colors.',
        },
        {
          title: 'clantag',
          text: 'A static violencia.top clantag or a smooth looping animation of the name.',
        },
      ],
    },
    weapons: {
      eyebrow: 'profiles',
      title: 'separate weapon profiles',
      lead: 'The profile is applied automatically on weapon switch. Each group has its own health threshold for body aim.',
      list: [
        { name: 'g3sg1 / scar-20', role: 'autosniper' },
        { name: 'ssg 08', role: 'scout' },
        { name: 'awp', role: 'sniper' },
        { name: 'r8 revolver', role: 'revolver' },
        { name: 'desert eagle', role: 'deagle' },
        { name: 'pistol', role: 'pistols' },
      ],
      hitboxTitle: 'target hitboxes',
      hitboxes: ['head', 'chest', 'stomach', 'arms', 'legs', 'feet'],
      pingTitle: 'latency compensation',
      pings: [
        'automatic real ping detection',
        'low ping',
        'medium ping',
        'high ping',
        'unstable connection',
      ],
    },
    predict: {
      eyebrow: 'core',
      title: 'advanced prediction',
      lead: 'Three mechanisms work together and cover different types of enemy movement.',
      items: [
        {
          name: 'extra prediction',
          text: 'Accounts for additional enemy movement and calculates the future position more precisely.',
        },
        {
          name: 'jitterfix',
          text: 'Detects sharp angle changes and stabilizes the calculation against jitter movement.',
        },
        {
          name: 'flickfix',
          text: 'Reacts to fast defensive flicks and corrects prediction at the moment of a sharp angle change.',
        },
      ],
      baimTitle: 'baim if lethal',
      baimText: 'The feature enables forced body aim once enemy health drops below the value you set. After the target dies, all temporary settings are removed.',
      baimSteps: [
        'force safe point returns to on hotkey mode',
        'head is removed from avoid unsafe hitboxes',
        'forced body aim is turned off',
      ],
    },
    tech: {
      eyebrow: 'under the hood',
      title: 'how it is calculated',
      lead: 'The resolver runs on real net channel data instead of guessing from frames.',
      items: [
        {
          name: 'smart target selection',
          text: 'If the closest enemy is behind a wall, the target is picked among those you can actually damage, and the one closest to the crosshair wins. The search is throttled and recalculated every 4 ticks.',
        },
        {
          name: 'multi-hitbox 3d halos',
          text: 'Halos are built around the selected hitboxes with cached tables and adaptive detail: 16 segments for close targets and 10 for distant ones.',
        },
        {
          name: 'correct latency model',
          text: 'Extrapolation uses one-way latency instead of scoreboard RTT: the scoreboard ping is halved, so the delay is never counted twice.',
        },
        {
          name: 'circular mean on yaw',
          text: 'The mean angle is computed with atan2 over the sum of sines and cosines, so the ±180° wrap is handled correctly. History holds 6 samples, 3 minimum for analysis.',
        },
        {
          name: 'simtime gating',
          text: 'Yaw is recorded only on a real network update instead of every frame. That removes false positives in jitter and flick detection.',
        },
        {
          name: 'full cleanup',
          text: 'Temporary changes are reverted on shutdown and at round start, and menu elements only appear when their dependencies are enabled.',
        },
      ],
      specTitle: 'default values',
      specs: [
        { k: 'jitter threshold', v: '20°' },
        { k: 'flick yaw threshold', v: '70°' },
        { k: 'extra prediction', v: '14 ticks' },
        { k: 'halo segments', v: '16 / 10' },
        { k: 'lod distance', v: '2500 units' },
        { k: 'target cache', v: '4 ticks' },
      ],
      formulaTitle: 'extrapolation',
      formulas: [
        'total_time = latency + (1 + extra_ticks) × tickinterval',
        'predict = hitbox + velocity × total_time',
        'predict_z = z + vz × t − 0.5 × gravity × t²',
      ],
      formulaNote: 'While airborne the position is additionally corrected for gravity, so the halo never floats above a jumping target.',
    },
    visuals: {
      eyebrow: 'on screen',
      title: 'visual indicators',
      lead: 'You can see what the resolver actually calculates and compare it with the real enemy position.',
      items: [
        {
          name: 'draw predict',
          text: 'Shows the calculated future position of the target.',
        },
        {
          name: 'draw real position',
          text: 'Displays the real enemy position for easy comparison.',
        },
        {
          name: 'show ping under crosshair',
          text: 'Prints current latency next to the crosshair.',
        },
      ],
      colorsTitle: 'color settings',
      colors: ['prediction', 'real position', 'tracer'],
      tracerTitle: 'tracer origin',
      tracers: ['screen center', 'bottom of the screen', 'top of the screen'],
    },
    clantag: {
      eyebrow: 'clantag',
      title: 'static and loop',
      staticLabel: 'static',
      staticText: 'Permanently displays violencia.top.',
      loopLabel: 'loop',
      loopText: 'Scrolls the name smoothly in a loop for an animated clantag.',
    },
    ui: {
      eyebrow: 'interface',
      title: 'one consistent menu',
      text: 'Every element follows the same style and uses lowercase labels. The global toggle fades smoothly from scarlet red to snow white.',
      toggleLabel: 'violencia resolver',
    },
    cta: {
      title: 'one resolver, one menu',
      text: 'Separate weapon profiles, adaptive prediction, correction for complex movement, automatic body aim and visual tools in one compact menu.',
      primary: 'download violencianightly.lua',
      secondary: 'message on telegram',
      fileTitle: 'violencianightly.lua',
      fileMeta: 'lua • gamesense',
      fileSteps: [
        'download violencianightly.lua and drop it into your lua folder',
        'load the script in the gamesense script manager',
        'enable violencia resolver under rage → other',
      ],
      contactTitle: 'contact',
      contactText: 'Questions about setup or access go straight to telegram.',
      contactHandle: 't.me/qirel',
      newsTitle: 'news',
      newsText: 'Script updates and the changelog are posted in the channel.',
      newsHandle: 't.me/violencialua',
    },
    footer: {
      note: 'Script for gamesense. Not affiliated with Valve Corporation.',
      rights: 'All rights reserved.',
      contactLabel: 'contact',
      newsLabel: 'news',
    },
  },
}

export type Dict = (typeof content)['ru']
