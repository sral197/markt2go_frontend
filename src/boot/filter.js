import { weekDays } from 'assets/app.config'
import { date } from 'quasar'
const { formatDate } = date

export default ({ app, router, store, Vue }) => {
  // Get Weekday filter
  Vue.filter('getWeekdayStr', function (dayOfWeek) {
    return weekDays[dayOfWeek]
  })
  // Get date
  Vue.filter('getFormatedDate', function (date, format) {
    return formatDate(date, format)
  })
  // Payment method
  Vue.filter('getPaymentMethodOfSeller', function (seller) {
    var paymentMethods = []
    var addPaymentMethod = function (accepted, label) {
      if (accepted) {
        paymentMethods.push(label)
      }
    }
    addPaymentMethod(seller.debitCardAccepted, 'EC-Kartenzahlung')
    addPaymentMethod(seller.creditCardAccepted, 'Kreditkartenzahlung')
    return paymentMethods.join(', ')
  })
  // Currency
  Vue.filter('getAsCurrency', function (number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number)
  })
  // Decimal
  Vue.filter('getAsDecimal', function (number) {
    return new Intl.NumberFormat('de-DE', { style: 'decimal' }).format(number)
  })
}
