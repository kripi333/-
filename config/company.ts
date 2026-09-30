/**
 * Единый источник контактных данных компании.
 * Меняем только здесь — подтягивается в хедер, футер, калькулятор, страницу заявки,
 * мобильную панель, юридические страницы и метаданные.
 */
export const company = {
  name: "Kushch Services",
  /** TODO: заменить на реальные юридические данные перед публикацией (Impressum). */
  legal: {
    street: "Musterstraße 24",
    city: "10115 Berlin",
    country: "Deutschland",
    register: "",
    vatId: "",
  },
  email: "kustimofej@gmail.com",
  phone: {
    /** Как показываем пользователю */
    display: "+49 160 4561409",
    /** Для ссылки tel: — только цифры и + */
    href: "tel:+491604561409",
  },
  whatsapp: "https://wa.me/491604561409",
  telegram: "https://t.me/kushchservices",
  hours: "Mo–Sa · 08:00–19:00",
  /** TODO: заменить на фактический домен перед публикацией. */
  site: "https://kushch-services.de",
} as const;

export const contactLinks = {
  phone: company.phone.href,
  email: `mailto:${company.email}`,
} as const;
