export type Language = 'en' | 'zh';

export const translations = {
  navigation: {
    about: { en: 'About', zh: '关于' },
    publications: { en: 'Publications', zh: '论文' },
    projects: { en: 'Projects', zh: '项目' },
    resources: { en: 'Resources', zh: '资源' },
    cv: { en: 'CV', zh: '简历' },
    teaching: { en: 'Teaching', zh: '教学' },
    services: { en: 'Services', zh: '服务' },
    awards: { en: 'Awards', zh: '获奖' },
  },
  author: {
    name: { en: 'Yitao Yang', zh: '杨溢涛' },
    title: { en: 'PhD Student', zh: '在读博士研究生' },
    institution: { en: 'Xi\'an Jiaotong University', zh: '西安交通大学' },
    englishName: { en: 'English name', zh: '英文名' },
  },
  profile: {
    researchInterests: { en: 'Research Interests', zh: '研究兴趣' },
  },
  sections: {
    about: { en: 'About', zh: '关于' },
    news: { en: 'Latest News', zh: '最新动态' },
    selectedPublications: { en: 'Selected Publications', zh: '精选论文' },
    latestProjects: { en: 'Latest Projects', zh: '最新项目' },
    latestResources: { en: 'Latest Resources', zh: '最新资源' },
  },
  common: {
    showMore: { en: 'Show More', zh: '展开更多' },
    showLess: { en: 'Show Less', zh: '收起' },
  }
} as const;

export function getTranslation(lang: Language, category: keyof typeof translations, key: string): string {
  const categoryObj = translations[category] as any;
  if (categoryObj && categoryObj[key]) {
    return categoryObj[key][lang] || categoryObj[key].en;
  }
  return key;
}