'use strict';

// ---------------------------------------------------------------------------

const gdax = require ('./gdax.js');

// ---------------------------------------------------------------------------

module.exports = class coinbasepro extends gdax {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'coinbasepro',
            'name': 'Coinbase Pro',
            'urls': {
                'test': 'https://api-public.sandbox.pro.coinbase.com',
                'logo': 'https://user-images.githubusercontent.com/1294454/41764625-63b7ffde-760a-11e8-996d-a6328fa9347a.jpg',
                'api': {
                    'public': 'https://api.pro.coinbase.com',
                    'private': 'https://api.pro.coinbase.com',
                },
                'www': 'https://pro.coinbase.com/',
                'doc': 'https://docs.pro.coinbase.com/',
                'fees': [
                    'https://docs.pro.coinbase.com/#fees',
                    'https://support.pro.coinbase.com/customer/en/portal/articles/2945310-fees',
                ],
            },
        });
    }
};
