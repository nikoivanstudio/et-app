/**
 * Адреса страниц. Собраны в одном месте, потому что кабинет гида ссылается
 * и сам на себя (шесть разделов), и на публичные страницы тура и гида —
 * а публичные адреса заодно участвуют в sitemap и перелинковке.
 */
export const routes = {
  signIn: () => `/sign-in`,
  signUp: () => `/sign-up`,
  becomePartner: () => `/become-partner`,

  /** Публичные страницы, на которые кабинет отправляет «посмотреть на сайте». */
  tour: (slug: string) => `/tour/${slug}`,
  guide: (slug: string) => `/guide/${slug}`,

  /**
   * Кабинет гида. `userId` в адресе остался от прежнего дашборда: по нему
   * же приходят ссылки из писем о новой заявке и новом сообщении.
   */
  cabinet: {
    overview: (userId: number | string) => `/dashboard/${userId}`,
    bookings: (userId: number | string) => `/dashboard/${userId}/bookings`,
    booking: (userId: number | string, bookingId: number) =>
      `/dashboard/${userId}/bookings?booking=${bookingId}`,
    messages: (userId: number | string) => `/dashboard/${userId}/messages`,
    thread: (userId: number | string, bookingId: number) =>
      `/dashboard/${userId}/messages?booking=${bookingId}`,
    tours: (userId: number | string) => `/dashboard/${userId}/tours`,
    newTour: (userId: number | string) => `/dashboard/${userId}/tours/new`,
    tourEditor: (userId: number | string, tourId: number) =>
      `/dashboard/${userId}/tours/${tourId}`,
    reviews: (userId: number | string) => `/dashboard/${userId}/reviews`,
    profile: (userId: number | string) => `/dashboard/${userId}/profile`
  }
};
