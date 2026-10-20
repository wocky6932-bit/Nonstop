import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeComingSoonConfig, normalizeComingSoonProduct } from '../lib/coming-soon-config'

describe('coming soon config normalization', () => {
  it('adds a price and currency to preorder products', () => {
    const config = normalizeComingSoonConfig({
      preorderProducts: [{
        id: 'tee-01',
        name: 'TEE 01',
        description: 'Desc',
        image: '/tee-01.jpeg',
        sizes: ['S', 'M'],
        is_preorder: true,
        price: '25000'
      }]
    })

    assert.equal(config.preorderProducts[0].price, 25000)
    assert.equal(config.preorderProducts[0].currency, 'XOF')
    assert.equal(config.preorderProducts[0].image, '/tee-01.jpeg')
  })

  it('keeps defaults when a product is incomplete', () => {
    const product = normalizeComingSoonProduct({ is_preorder: true })

    assert.equal(product.price, 0)
    assert.equal(product.currency, 'XOF')
    assert.equal(product.image, '/precommande.jpeg')
  })
})
