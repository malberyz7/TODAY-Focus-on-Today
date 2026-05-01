export type Locale = "ru" | "en";

export const LOCALE_STORAGE_KEY = "habit-app-locale";

export const defaultLocale: Locale = "ru";

const ru = {
  metaTitle: "Still — привычки и дневник",
  metaDescription:
    "Отслеживайте привычки, ведите дневник, смотрите серии и прогресс в спокойном интерфейсе.",
  disciplineTag: "Дисциплина наглядно",
  titleDashboard: "Твои чистые серии",
  subtitleDashboard:
    "Отмечай привычки, которые оставляешь в прошлом. Честное нажатие раз в день — честная серия.",
  activeGoals: "активных целей",
  activeGoalsOne: "активная цель",
  habit: "Привычка",
  missedDay: "Пропуск",
  onPath: "В плане",
  progress: "Прогресс",
  streak: "Серия",
  daysShort: "дн.",
  milestones: "Вехи",
  openDetail: "Подробнее",
  todayNote: "Заметка на сегодня",
  dailyNotes: "Дневник",
  dailyNotesSubtitle: "Мысли и самочувствие по дням",
  selectDay: "Выберите день в календаре",
  pickToday: "Сегодня",
  calendarPrev: "Предыдущий месяц",
  calendarNext: "Следующий месяц",
  calendarHint:
    "Нажмите на день, чтобы открыть заметку. Отметка «чистого дня» — в панели заметки.",
  cleanDay: "Чистый день",
  cleanDayOn: "День отмечен",
  cleanDayOff: "Не отмечен",
  close: "Закрыть",
  deleteNote: "Удалить заметку",
  saved: "Сохранено",
  saving: "Сохранение…",
  notePlaceholder: "Как ты себя сегодня чувствуешь?",
  noteOverflowHint: "При сохранении лишнее обрежется до 1000 символов.",
  newHabit: "Новая привычка",
  addHabitTitle: "Победить привычку",
  addHabitDesc:
    "Назови, от чего уходишь, и выбери срок. Все данные хранятся только на этом устройстве.",
  habitNameLabel: "Привычка",
  habitPlaceholder: "Например, импульсивные покупки онлайн",
  goalLength: "Длина цели (дней)",
  cancel: "Отмена",
  addToDashboard: "Добавить на главную",
  deleteHabit: "Удалить привычку",
  deleteHabitTitle: "Удалить привычку?",
  deleteHabitDesc:
    "«{name}» и весь прогресс будут удалены с этого устройства. Это действие нельзя отменить.",
  confirmDelete: "Удалить привычку",
  stayedCleanToday: "Сегодня я справился",
  completedToday: "Выполнено ✓",
  completion: "Завершение",
  successfulDaysLine: "{completed} успешных дней · осталось {remaining} дней до цели",
  cleanDaysLine: "{completed} / {goal} чистых дней · осталось {remaining}",
  currentStreak: "Текущая серия",
  badges: "Значки",
  habitDetail: "Карточка привычки",
  repairStreak: "Вернись к серии сегодня",
  lockedIn: "В ритме",
  backDashboard: "На главную",
  habitNotFound: "Такой привычки нет (или она удалена).",
  langRu: "RU",
  langEn: "EN",
  language: "Язык",
  emptyHabits: "Пока нет привычек — добавь первую цель.",
  notFoundBack: "На главную",
  dialogClose: "Закрыть",
  noLimitOption: "Без срока (∞)",
  lifetimeMode: "Без срока",
  cleanDaysTotal: "Чистых дней",
  holdingDaysSubtitle: "Ты держишься уже {n} дней",
  longestStreak: "Рекорд серии",
  nextMilestone: "Следующая веха: {n} дн.",
  milestoneProgress: "Путь к следующей вехе",
  allMilestonesDone: "Все отметки пройдены — дальше только ты и ритм.",
  infiniteMotivationMissed: "Пропуск случился — важно, как ты отвечаешь сегодня.",
  infiniteMotivationDefault:
    "Без финального «финиша»: каждый день — это выбор, кем ты становишься.",
  infiniteCardFooter: "Всего {total} чистых дней · серия {streak} · рекорд {longest}",
  addHabitStepBasics: "Шаг 1 — цель",
  addHabitStepMotivation: "Шаг 2 — зачем тебе это",
  motivationStepTitle: "Зачем ты это начинаешь",
  motivationStepSubtitle:
    "Честные ответы помогут в трудный момент — их увидишь только ты, здесь, на устройстве.",
  motivationWhyQuestion: "Почему я хочу это сделать?",
  motivationBenefitQuestion: "Что мне это даст?",
  motivationLossQuestion: "Что я потеряю, если не изменюсь?",
  motivationWhyPlaceholder: "Например: устал от последствий и хочу другой ритм…",
  motivationBenefitPlaceholder: "Спокойствие, здоровье, уважение к себе…",
  motivationLossPlaceholder: "Что дорого — если всё останется по-старому…",
  addHabitNext: "Далее",
  addHabitBack: "Назад",
  strugglingButton: "Мне сложно",
  recoveryDialogTitle: "Ты не один в этом моменте",
  recoveryDialogLead: "Напоминание о том, зачем ты начал — без осуждения, только опора.",
  recoveryWhyYouStarted: "Вот почему ты начал",
  recoveryYourStreak: "Сейчас серия",
  recoveryYourProgress: "Сейчас прогресс",
  recoveryMotivationWhy: "Почему",
  recoveryMotivationBenefit: "Что даст",
  recoveryMotivationLoss: "Цена без изменений",
  recoveryEmptyAnswer: "Ответ не записан — можно вспомнить вслух или дописать в заметке.",
  recoverySupportFooter: "Срыв не отменяет смысл. Один шаг сегодня всё ещё имеет вес.",
  levelTier1: "Новичок",
  levelTier2: "Стабильный",
  levelTier3: "Сильная воля",
  levelTier4: "Дисциплина",
  levelTier5: "Мастер",
  levelBadgeAria: "Уровень: {label}",
  antiSryvTitle: "Короткая проверка осознанности",
  antiSryvLead: "«{name}» — не спеша, честно ответь на два вопроса.",
  antiSryvQ1: "Ты действительно сегодня справился?",
  antiSryvQ2: "Что было самым сложным за последние дни?",
  antiSryvQ3: "Почему ты держишься?",
  antiSryvPlaceholder: "Пару предложений, как есть…",
  antiSryvHint: "Ответы сохраняются с сегодняшней датой — это про честность с собой, не про оценку.",
  antiSryvLater: "Позже",
  antiSryvSave: "Сохранить ответы",
  antiSryvIntervalLabel: "Проверка каждые",
  antiSryvInterval2: "2 дня",
  antiSryvInterval3: "3 дня",
  honestStatsTitle: "Честная статистика",
  honestStatsSubtitle: "Успехи и пропуски — в одном поле зрения. Скрывать срывы не помогает.",
  honestStatsClean: "Чистых дней",
  honestStatsMissed: "Дней без отметки",
  honestStatsReturns: "Возвратов после срыва",
  honestCardLine: "{clean} чистых · {miss} без отметки",
  ritualsTitle: "Ритуалы дня",
  ritualsSubtitle: "Утро задаёт фокус, вечер — честный итог.",
  ritualMorningTitle: "Утро",
  ritualMorningFocusLabel: "Сегодня я сфокусирован на…",
  ritualMorningPlaceholder: "Одна строка, что важно удержать…",
  ritualMorningStart: "Начать день",
  ritualEveningTitle: "Вечер",
  ritualEveningCheckLabel: "Сегодня получилось так, как хотел?",
  ritualEveningYes: "Да",
  ritualEveningNo: "Не совсем",
  ritualEveningNoteLabel: "Короткая заметка",
  ritualEveningNotePlaceholder: "Что сработало, что нет…",
  aboutAuthorNav: "Об авторе",
  aboutAuthorTitle: "Об авторе",
  aboutAuthorParagraph1: "Моё имя Алимжан, мне 17 лет, я заканчиваю 11 класс.",
  aboutAuthorParagraph2:
    "Раньше у меня, как и у всех, были плохие привычки, и я часто угнетал себя из-за этого.",
  aboutAuthorParagraph3: "Я решил создать этот проект, чтобы избавиться от них.",
  aboutAuthorParagraph4:
    "Я знаю, что таких людей, как я, много, и этот проект изначально был инструментом, который я сделал для себя.",
  aboutAuthorParagraph5:
    "Но позже я решил опубликовать его, чтобы он мог помочь и другим людям.",
  aboutAuthorParagraph6:
    "Надеюсь, этот инструмент будет вам полезен и поможет в изменениях в жизни.",
  aboutAuthorParagraph7: "Спасибо и удачи в начинаниях.",
  aboutAuthorContactLabel: "Связь",
  howItWorksNav: "Как пользоваться",
  howItWorksTitle: "Как пользоваться",
  howItWorksParagraph1:
    "Главное в этом приложении — быть честным с самим собой. Не обманывать себя и отвечать на вопросы максимально честно.",
  howItWorksParagraph2:
    "Регулярно следите за своим трекером привычек — так вы сможете реально замечать свой прогресс и изменения в жизни.",
  howItWorksQuote: "Честность с самим собой — первый шаг к изменениям.",
  copiedToast: "Скопировано",
} as const;

const en: Record<keyof typeof ru, string> = {
  metaTitle: "Still — habits & journal",
  metaDescription:
    "Track habits you are leaving behind, journal daily, and see streaks in a calm dashboard.",
  disciplineTag: "Discipline, visualized",
  titleDashboard: "Your clean streaks",
  subtitleDashboard:
    "Track the habits you are leaving behind. One honest tap a day keeps your streak honest.",
  activeGoals: "active goals",
  activeGoalsOne: "active goal",
  habit: "Habit",
  missedDay: "Missed day",
  onPath: "On path",
  progress: "Progress",
  streak: "Streak",
  daysShort: "days",
  milestones: "Milestones",
  openDetail: "Open detail",
  todayNote: "Today’s note",
  dailyNotes: "Daily notes",
  dailyNotesSubtitle: "Thoughts and how you felt, day by day",
  selectDay: "Pick a day on the calendar",
  pickToday: "Today",
  calendarPrev: "Previous month",
  calendarNext: "Next month",
  calendarHint:
    "Tap a day to open your note. Mark a clean day from the note panel.",
  cleanDay: "Clean day",
  cleanDayOn: "Marked clean",
  cleanDayOff: "Not marked",
  close: "Close",
  deleteNote: "Delete note",
  saved: "Saved",
  saving: "Saving…",
  notePlaceholder: "How are you feeling today?",
  noteOverflowHint: "Anything beyond 1000 characters will be trimmed when saved.",
  newHabit: "New habit",
  addHabitTitle: "Break a habit",
  addHabitDesc:
    "Name what you are quitting and pick a runway. Progress stays on this device.",
  habitNameLabel: "Habit",
  habitPlaceholder: "e.g. compulsive online shopping",
  goalLength: "Goal length (days)",
  cancel: "Cancel",
  addToDashboard: "Add to dashboard",
  deleteHabit: "Delete habit",
  deleteHabitTitle: "Delete this habit?",
  deleteHabitDesc:
    "“{name}” and all progress will be removed from this device. This cannot be undone.",
  confirmDelete: "Delete habit",
  stayedCleanToday: "I stayed clean today",
  completedToday: "Completed ✓",
  completion: "Completion",
  successfulDaysLine: "{completed} successful days · {remaining} days left in this goal",
  cleanDaysLine: "{completed} / {goal} clean days · {remaining} to go",
  currentStreak: "Current streak",
  badges: "Badges",
  habitDetail: "Habit detail",
  repairStreak: "Repair your streak today",
  lockedIn: "Locked in",
  backDashboard: "Dashboard",
  habitNotFound: "This habit does not exist (or was removed).",
  langRu: "RU",
  langEn: "EN",
  language: "Language",
  emptyHabits: "No habits yet — add your first commitment.",
  notFoundBack: "Back to dashboard",
  dialogClose: "Close",
  noLimitOption: "No limit (∞)",
  lifetimeMode: "Lifetime",
  cleanDaysTotal: "Clean days",
  holdingDaysSubtitle: "You have stayed with it for {n} days",
  longestStreak: "Longest streak",
  nextMilestone: "Next milestone: {n} days",
  milestoneProgress: "Progress to next milestone",
  allMilestonesDone: "All milestones reached — from here, it is rhythm and identity.",
  infiniteMotivationMissed: "A miss happened — what matters is how you respond today.",
  infiniteMotivationDefault:
    "No finish line — each day is a vote for who you are becoming.",
  infiniteCardFooter: "{total} clean days total · streak {streak} · best {longest}",
  addHabitStepBasics: "Step 1 — goal",
  addHabitStepMotivation: "Step 2 — why it matters",
  motivationStepTitle: "Why you are starting",
  motivationStepSubtitle:
    "Honest answers become an anchor on hard days. They stay on this device, for you.",
  motivationWhyQuestion: "Why do I want to do this?",
  motivationBenefitQuestion: "What will it give me?",
  motivationLossQuestion: "What will I lose if I do not change?",
  motivationWhyPlaceholder: "e.g. I am tired of the cost and want a calmer rhythm…",
  motivationBenefitPlaceholder: "Peace, health, self-respect…",
  motivationLossPlaceholder: "What matters that stays the same if nothing changes…",
  addHabitNext: "Continue",
  addHabitBack: "Back",
  strugglingButton: "I'm struggling",
  recoveryDialogTitle: "You are not alone in this moment",
  recoveryDialogLead: "A gentle return to why you started — no shame, just support.",
  recoveryWhyYouStarted: "Here is why you started",
  recoveryYourStreak: "Current streak",
  recoveryYourProgress: "Where you are now",
  recoveryMotivationWhy: "Why",
  recoveryMotivationBenefit: "What it gives you",
  recoveryMotivationLoss: "Cost of staying the same",
  recoveryEmptyAnswer: "No note saved yet — you can say it out loud or add it in your journal.",
  recoverySupportFooter: "A slip does not erase the point. One step today still counts.",
  levelTier1: "Novice",
  levelTier2: "Steady",
  levelTier3: "Strong will",
  levelTier4: "Discipline",
  levelTier5: "Master",
  levelBadgeAria: "Level: {label}",
  antiSryvTitle: "A short awareness check",
  antiSryvLead: "“{name}” — two honest answers, without rushing.",
  antiSryvQ1: "Did you truly stay with your intention today?",
  antiSryvQ2: "What was hardest over the last few days?",
  antiSryvQ3: "Why are you still holding on?",
  antiSryvPlaceholder: "A sentence or two, as it is…",
  antiSryvHint: "Answers are saved with today’s date — for honesty with yourself, not for judgment.",
  antiSryvLater: "Not now",
  antiSryvSave: "Save answers",
  antiSryvIntervalLabel: "Check every",
  antiSryvInterval2: "2 days",
  antiSryvInterval3: "3 days",
  honestStatsTitle: "Honest statistics",
  honestStatsSubtitle: "Wins and misses in one view. Hiding slips does not help.",
  honestStatsClean: "Clean days",
  honestStatsMissed: "Days without a mark",
  honestStatsReturns: "Comebacks after a slip",
  honestCardLine: "{clean} clean · {miss} unmarked",
  ritualsTitle: "Daily rituals",
  ritualsSubtitle: "Morning sets focus; evening is an honest close.",
  ritualMorningTitle: "Morning",
  ritualMorningFocusLabel: "Today I am focused on…",
  ritualMorningPlaceholder: "One line to hold onto…",
  ritualMorningStart: "Start the day",
  ritualEveningTitle: "Evening",
  ritualEveningCheckLabel: "Did today go the way you wanted?",
  ritualEveningYes: "Yes",
  ritualEveningNo: "Not quite",
  ritualEveningNoteLabel: "Short note",
  ritualEveningNotePlaceholder: "What worked, what did not…",
  aboutAuthorNav: "About author",
  aboutAuthorTitle: "About the author",
  aboutAuthorParagraph1: "My name is Alimzhan, I am 17 years old, and I am finishing 11th grade.",
  aboutAuthorParagraph2:
    "In the past, like everyone else, I had bad habits, and I often put myself down because of them.",
  aboutAuthorParagraph3: "I decided to create this project to get rid of them.",
  aboutAuthorParagraph4:
    "I know there are many people like me, and this project was originally a tool I made for myself.",
  aboutAuthorParagraph5:
    "But later I decided to publish it so it could help other people too.",
  aboutAuthorParagraph6:
    "I hope this tool will be useful for you and help bring positive changes to your life.",
  aboutAuthorParagraph7: "Thank you, and good luck in your new beginnings.",
  aboutAuthorContactLabel: "Contact",
  howItWorksNav: "How it works",
  howItWorksTitle: "How it works",
  howItWorksParagraph1:
    "The most important thing in this app is to be honest with yourself. Don’t lie to yourself and answer questions as honestly as possible.",
  howItWorksParagraph2:
    "Keep track of your habit tracker regularly — this is how you will notice real progress and changes in your life.",
  howItWorksQuote: "Honesty with yourself is the first step to change.",
  copiedToast: "Copied",
};

export const messages = { ru, en } as const;

export type MessageKey = keyof typeof ru;

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export function getMotivationMessage(
  locale: Locale,
  percent: number,
  missed: boolean,
  options?: { infinite?: boolean }
): string {
  if (options?.infinite) {
    if (missed) {
      return messages[locale].infiniteMotivationMissed;
    }
    return messages[locale].infiniteMotivationDefault;
  }
  if (missed && percent < 100) {
    return locale === "ru"
      ? "Срыв — это данные, не приговор. Закрепись сегодня."
      : "A slip is data, not destiny — lock in today.";
  }
  if (percent >= 100) {
    return locale === "ru"
      ? "Цель достигнута. Ты доказал: важнее ритм, чем рывки."
      : "Goal complete. You proved consistency beats intensity.";
  }
  if (percent >= 85) {
    return locale === "ru"
      ? "Финишная прямая — береги серию, которую выстроил."
      : "Final stretch — protect the streak you built.";
  }
  if (percent >= 65) {
    return locale === "ru"
      ? "Большая часть пути позади. Продолжай в том же спокойном темпе."
      : "You are most of the way there. Stay boringly consistent.";
  }
  if (percent >= 40) {
    return locale === "ru"
      ? "Импульс уже чувствуется. Копи чистые дни."
      : "Momentum is forming. Keep stacking clean days.";
  }
  if (percent >= 15) {
    return locale === "ru"
      ? "Старт решает: сегодняшний день стоит двух завтрашних."
      : "Early days count double — show up again today.";
  }
  return locale === "ru"
    ? "Энергия первого дня: маленькие победы складываются."
    : "Day one energy: small wins compound.";
}

export function weekdayShortLabels(locale: Locale): string[] {
  return locale === "ru"
    ? ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
    : ["S", "M", "T", "W", "T", "F", "S"];
}
