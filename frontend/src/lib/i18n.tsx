import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "mk" | "en";

const STORAGE_KEY = "mk-llm-arena:lang";

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  mk: {
    // nav
    "nav.home": "Дома",
    "nav.ask": "Разговор",
    "nav.questions": "Прашања",
    "nav.models": "Модели",
    "nav.users": "Корисници",
    "nav.profile": "Мој профил",
    "nav.logout": "Одјави се",
    "nav.account": "Сметка",
    "nav.menu": "Мени",
    "nav.history": "Историја",
    "role.ROLE_USER": "Корисник",
    "role.ROLE_EVALUATOR": "Евалуатор",
    "role.ROLE_ADMIN": "Администратор",
    "lang.switch": "Јазик",

    "history.title": "Историја на евалуации",
    "history.subtitle": "Сите евалуации низ сите прашања, подредени по најнови.",
    "history.empty": "Сè уште нема евалуации.",
    "history.question": "Прашање",

    // home
    "home.badge": "MK LLM Arena",
    "home.welcome": "Добредојдовте",
    "home.intro":
      "Платформа за евалуација на јазични модели на македонски јазик. Поставувајте прашања, споредувајте одговори и рангирајте перформанси на различни LLM модели.",
    "home.cta.start": "Започни разговор",
    "home.cta.browse": "Прегледај прашања",
    "home.tile.ask.title": "Разговор со модел",
    "home.tile.ask.desc": "Поставете прашање и добијте одговор од избран LLM модел.",
    "home.tile.questions.title": "Банка на прашања",
    "home.tile.questions.desc": "Прегледајте ги достапните прашања и нивните евалуации.",
    "home.tile.models.title": "Управување со модели",
    "home.tile.models.desc": "Додавајте и конфигурирајте LLM модели.",
    "home.tile.users.title": "Управување со корисници",
    "home.tile.users.desc": "Доделувајте улоги и управувајте сметки.",
    "home.tile.profile.title": "Мој профил",
    "home.tile.profile.desc": "Ажурирајте лични податоци и лозинка.",

    // questions list
    "questions.title": "Банка на прашања",
    "questions.subtitle": "Прегледајте ги прашањата, отворете едно за детали и евалуации.",
    "questions.search": "Пребарај...",
    "questions.category": "Категорија",
    "questions.difficulty": "Тежина",
    "questions.allCategories": "Сите категории",
    "questions.allDifficulties": "Сите тежини",
    "questions.empty": "Нема пронајдени прашања.",
    "questions.test": "Тестирај",

    // question detail
    "detail.back": "Назад кон прашања",
    "detail.test": "Тестирај прашање",
    "detail.notFound": "Прашањето не е пронајдено.",
    "detail.evaluations": "Евалуации",
    "detail.empty": "Сè уште нема евалуации за ова прашање.",
    "detail.edit": "Уреди",
    "detail.by": "од",
    "detail.addEvaluation": "Додади евалуација",
    "detail.getAnswer": "Земи одговор",

    // evaluation panel
    "eval.title": "Евалуација",
    "eval.editTitle": "Уреди евалуација",
    "eval.fluency": "Течност",
    "eval.accuracy": "Точност",
    "eval.relevance": "Релевантност",
    "eval.grammar": "Граматика",
    "eval.comment": "Коментар",
    "eval.commentPh": "Забелешки за одговорот...",
    "eval.evaluator": "Евалуатор",
    "eval.save": "Зачувај евалуација",
    "eval.saveEdit": "Зачувај измени",
    "eval.cancel": "Откажи",
    "eval.savedToast": "Евалуацијата е зачувана",
    "eval.updatedToast": "Евалуацијата е ажурирана",

    // ask
    "ask.title": "Разговор со модел",
    "ask.subtitle": "Изберете модел, поставете прашање на македонски и добијте одговор.",
    "ask.compareOn": "Спореди 2 модели",
    "ask.compareOff": "Единечен режим",
    "ask.compareDesc": "Спореди 2 модели",
    "ask.model": "Модел",
    "ask.modelN": "Модел",
    "ask.selectModel": "Изберете модел",
    "ask.loadingModels": "Се вчитуваат модели...",
    "ask.noModels": "Нема активни модели",
    "ask.question": "Прашање",
    "ask.questionPh": "Напишете прашање на македонски...",
    "ask.random": "Случајно",
    "ask.send": "Испрати",
    "ask.needQuestion": "Внесете прашање",
    "ask.pickQuestion": "Изберете прашање од листата или користете „Случајно“",
    "ask.pickModel": "Изберете модел",
    "ask.error": "Грешка",

    // models admin
    "models.title": "Управување со модели",
    "models.subtitle": "Регистрирајте и активирајте LLM модели за платформата.",
    "models.new": "Нов модел",
    "models.name": "Име",
    "models.provider": "Провајдер",
    "models.status": "Статус",
    "models.activeCol": "Активен",
    "models.active": "Активен",
    "models.inactive": "Неактивен",
    "models.empty": "Нема регистрирани модели.",
    "models.dialogTitle": "Регистрирај нов модел",
    "models.displayName": "Име за приказ",
    "models.config": "Конфигурација (JSON)",
    "models.save": "Зачувај",
    "models.created": "Моделот е креиран",
    "models.invalidConfig": "Невалиден JSON во конфигурацијата",
    "models.providerStatic": "Статички JSON",
    "models.providerOpenAI": "OpenAI",
    "models.providerAnthropic": "Anthropic",
    "models.providerCustomHttp": "Custom HTTP",

    // users admin
    "users.title": "Управување со корисници",
    "users.subtitle": "Доделете улоги на регистрираните корисници.",
    "users.username": "Корисничко име",
    "users.email": "Е-пошта",
    "users.role": "Улога",
    "users.empty": "Нема корисници.",
    "users.roleUpdated": "Улогата е ажурирана",

    "common.loading": "Се вчитува...",
  },

  en: {
    "nav.home": "Home",
    "nav.ask": "Chat",
    "nav.questions": "Questions",
    "nav.models": "Models",
    "nav.users": "Users",
    "nav.profile": "My profile",
    "nav.logout": "Log out",
    "nav.account": "Account",
    "nav.menu": "Menu",
    "nav.history": "History",
    "role.ROLE_USER": "User",
    "role.ROLE_EVALUATOR": "Evaluator",
    "role.ROLE_ADMIN": "Administrator",
    "lang.switch": "Language",

    "history.title": "Evaluation history",
    "history.subtitle": "All evaluations across every question, newest first.",
    "history.empty": "No evaluations yet.",
    "history.question": "Question",

    "home.badge": "MK LLM Arena",
    "home.welcome": "Welcome",
    "home.intro":
      "A platform for evaluating language models in Macedonian. Ask questions, compare answers, and rank the performance of different LLMs.",
    "home.cta.start": "Start a chat",
    "home.cta.browse": "Browse questions",
    "home.tile.ask.title": "Chat with a model",
    "home.tile.ask.desc": "Ask a question and get an answer from an LLM.",
    "home.tile.questions.title": "Question bank",
    "home.tile.questions.desc": "Browse available questions and their evaluations.",
    "home.tile.models.title": "Manage models",
    "home.tile.models.desc": "Add and configure LLM models.",
    "home.tile.users.title": "Manage users",
    "home.tile.users.desc": "Assign roles and manage accounts.",
    "home.tile.profile.title": "My profile",
    "home.tile.profile.desc": "Update personal information and password.",

    "questions.title": "Question bank",
    "questions.subtitle": "Browse questions, open one for details and evaluations.",
    "questions.search": "Search...",
    "questions.category": "Category",
    "questions.difficulty": "Difficulty",
    "questions.allCategories": "All categories",
    "questions.allDifficulties": "All difficulties",
    "questions.empty": "No questions found.",
    "questions.test": "Test",

    "detail.back": "Back to questions",
    "detail.test": "Test this question",
    "detail.notFound": "Question not found.",
    "detail.evaluations": "Evaluations",
    "detail.empty": "No evaluations yet for this question.",
    "detail.edit": "Edit",
    "detail.by": "by",
    "detail.addEvaluation": "Add evaluation",
    "detail.getAnswer": "Get answer",

    "eval.title": "Evaluation",
    "eval.editTitle": "Edit evaluation",
    "eval.fluency": "Fluency",
    "eval.accuracy": "Accuracy",
    "eval.relevance": "Relevance",
    "eval.grammar": "Grammar",
    "eval.comment": "Comment",
    "eval.commentPh": "Notes about the answer...",
    "eval.evaluator": "Evaluator",
    "eval.save": "Save evaluation",
    "eval.saveEdit": "Save changes",
    "eval.cancel": "Cancel",
    "eval.savedToast": "Evaluation saved",
    "eval.updatedToast": "Evaluation updated",

    "ask.title": "Chat with a model",
    "ask.subtitle": "Pick a model, ask a question in Macedonian, and get an answer.",
    "ask.compareOn": "Compare 2 models",
    "ask.compareOff": "Single mode",
    "ask.compareDesc": "Compare 2 models",
    "ask.model": "Model",
    "ask.modelN": "Model",
    "ask.selectModel": "Select a model",
    "ask.loadingModels": "Loading models...",
    "ask.noModels": "No active models",
    "ask.question": "Question",
    "ask.questionPh": "Type a question in Macedonian...",
    "ask.random": "Random",
    "ask.send": "Send",
    "ask.needQuestion": "Enter a question",
    "ask.pickQuestion": 'Pick a question from the list or use "Random"',
    "ask.pickModel": "Select a model",
    "ask.error": "Error",

    // models admin
    "models.title": "Manage models",
    "models.subtitle": "Register and activate LLM models for the platform.",
    "models.new": "New model",
    "models.name": "Name",
    "models.provider": "Provider",
    "models.status": "Status",
    "models.activeCol": "Active",
    "models.active": "Active",
    "models.inactive": "Inactive",
    "models.empty": "No registered models.",
    "models.dialogTitle": "Register a new model",
    "models.displayName": "Display name",
    "models.config": "Configuration (JSON)",
    "models.save": "Save",
    "models.created": "Model created",
    "models.invalidConfig": "Invalid JSON in configuration",
    "models.providerStatic": "Static JSON",
    "models.providerOpenAI": "OpenAI",
    "models.providerAnthropic": "Anthropic",
    "models.providerCustomHttp": "Custom HTTP",

    // users admin
    "users.title": "Manage users",
    "users.subtitle": "Assign roles to registered users.",
    "users.username": "Username",
    "users.email": "Email",
    "users.role": "Role",
    "users.empty": "No users.",
    "users.roleUpdated": "Role updated",

    "common.loading": "Loading...",
  },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("mk");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "mk" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? translations.mk[key] ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}
