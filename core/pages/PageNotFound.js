import builder from 'bodybuilder'

import i18n from '@vue-storefront/i18n'
import EventBus from '@vue-storefront/core/plugins/event-bus'

import Composite from '@vue-storefront/core/mixins/composite'

export default {
  name: 'PageNotFound',
  mixins: [Composite],
  asyncData ({ store, route }) { // this is for SSR purposes to prefetch data
    return new Promise((resolve, reject) => {
      console.log('Entering asyncData for PageNotFound ' + new Date())
      let ourBestsellersQuery = builder().query('range', 'visibility', { 'gte': 2, 'lte': 4 }/** Magento visibility in search & categories */).build()
      store.dispatch('category/list', {}).then(categories => {
        store.dispatch('product/list', {
          query: ourBestsellersQuery,
          size: 8,
          sort: 'created_at:desc'
        }).then(res => {
          if (res) {
            store.state.homepage.bestsellers = res.items
            EventBus.$emitFilter('pagenotfound-after-load', { store: store, route: route }).then(results => {
              return resolve()
            }).catch(err => {
              console.error(err)
              return resolve()
            })
          }
        })
      })
    })
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('404 Page Not Found'),
      meta: this.$route.meta.description ? [{ vmid: 'description', description: this.$route.meta.description }] : []
    }
  }
}
