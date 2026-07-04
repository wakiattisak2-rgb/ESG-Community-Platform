import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import thCommon from './locales/th/common.json'
import thLanding from './locales/th/landing.json'
import thDashboard from './locales/th/dashboard.json'
import thCommunity from './locales/th/community.json'
import thMarketplace from './locales/th/marketplace.json'
import thAuth from './locales/th/auth.json'

import enCommon from './locales/en/common.json'
import enLanding from './locales/en/landing.json'
import enDashboard from './locales/en/dashboard.json'
import enCommunity from './locales/en/community.json'
import enMarketplace from './locales/en/marketplace.json'
import enAuth from './locales/en/auth.json'

const savedLocale = localStorage.getItem('aetros-locale') || 'th'

i18n.use(initReactI18next).init({
  resources: {
    th: {
      common: thCommon,
      landing: thLanding,
      dashboard: thDashboard,
      community: thCommunity,
      marketplace: thMarketplace,
      auth: thAuth,
    },
    en: {
      common: enCommon,
      landing: enLanding,
      dashboard: enDashboard,
      community: enCommunity,
      marketplace: enMarketplace,
      auth: enAuth,
    },
  },
  lng: savedLocale,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('aetros-locale', lng)
  document.documentElement.lang = lng
})

document.documentElement.lang = savedLocale

export default i18n
