'use strict';

// ---------------------------------------------------------------------------

const bitfinex = require ('./bitfinex.js');
const { ExchangeError, NotSupported, InsufficientFunds } = require ('./base/errors');
const { redisRead, redisWrite } = require('../../../lib/utils');
// ---------------------------------------------------------------------------

module.exports = class bitfinex2 extends bitfinex {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'bitfinex2',
            'name': 'Bitfinex',
            'countries': [ 'VG' ],
            'version': 'v2',
            'certified': false,
            // new metainfo interface
            'has': {
                'CORS': true,
                'createLimitOrder': false,
                'createMarketOrder': false,
                'createOrder': false,
                'deposit': false,
                'editOrder': false,
                'fetchDepositAddress': false,
                'fetchClosedOrders': false,
                'fetchFundingFees': false,
                'fetchMyTrades': false, // has to be false https://github.com/ccxt/ccxt/issues/4971
                'fetchOHLCV': true,
                'fetchOpenOrders': false,
                'fetchOrder': true,
                'fetchTickers': true,
                'fetchDeposits': true,
                'fetchWithdrawals': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '3h': '3h',
                '6h': '6h',
                '12h': '12h',
                '1d': '1D',
                '1w': '7D',
                '2w': '14D',
                '1M': '1M',
            },
            'rateLimit': 1500,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
                'api': {
                    'v1': 'https://api.bitfinex.com',
                    'public': 'https://api-pub.bitfinex.com',
                    'private': 'https://api.bitfinex.com',
                },
                'www': 'https://www.bitfinex.com',
                'doc': [
                    'https://docs.bitfinex.com/v2/docs/',
                    'https://github.com/bitfinexcom/bitfinex-api-node',
                ],
                'fees': 'https://www.bitfinex.com/fees',
            },
            'api': {
                'v1': {
                    'get': [
                        'symbols',
                        'symbols_details',
                    ],
                },
                'public': {
                    'get': [
                        'platform/status',
                        'tickers',
                        'ticker/{symbol}',
                        'trades/{symbol}/hist',
                        'book/{symbol}/{precision}',
                        'book/{symbol}/P0',
                        'book/{symbol}/P1',
                        'book/{symbol}/P2',
                        'book/{symbol}/P3',
                        'book/{symbol}/R0',
                        'stats1/{key}:{size}:{symbol}:{side}/{section}',
                        'stats1/{key}:{size}:{symbol}/{section}',
                        'stats1/{key}:{size}:{symbol}:long/last',
                        'stats1/{key}:{size}:{symbol}:long/hist',
                        'stats1/{key}:{size}:{symbol}:short/last',
                        'stats1/{key}:{size}:{symbol}:short/hist',
                        'candles/trade:{timeframe}:{symbol}/{section}',
                        'candles/trade:{timeframe}:{symbol}/last',
                        'candles/trade:{timeframe}:{symbol}/hist',
                    ],
                    'post': [
                        'calc/trade/avg',
                        'calc/fx',
                    ],
                },
                'private': {
                    'post': [
                        'auth/r/wallets',
                        'auth/r/orders/{symbol}',
                        'auth/r/orders/{symbol}/new',
                        'auth/r/orders/{symbol}/hist',
                        'auth/r/order/{symbol}:{id}/trades',
                        'auth/r/trades/hist',
                        'auth/r/trades/{symbol}/hist',
                        'auth/r/positions',
                        'auth/r/positions/hist',
                        'auth/r/funding/offers/{symbol}',
                        'auth/r/funding/offers/{symbol}/hist',
                        'auth/r/funding/loans/{symbol}',
                        'auth/r/funding/loans/{symbol}/hist',
                        'auth/r/funding/credits/{symbol}',
                        'auth/r/funding/credits/{symbol}/hist',
                        'auth/r/funding/trades/{symbol}/hist',
                        'auth/r/info/margin/{key}',
                        'auth/r/info/funding/{key}',
                        'auth/r/ledgers/hist',
                        'auth/r/movements/hist',
                        'auth/r/movements/{currency}/hist',
                        'auth/r/stats/perf:{timeframe}/hist',
                        'auth/r/alerts',
                        'auth/w/alert/set',
                        'auth/w/alert/{type}:{symbol}:{price}/del',
                        'auth/calc/order/avail',
                        'auth/r/ledgers/{symbol}/hist',
                        'auth/r/settings',
                        'auth/w/settings/set',
                        'auth/w/settings/del',
                        'auth/r/info/user',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'maker': 0.1 / 100,
                    'taker': 0.2 / 100,
                },
                'funding': {
                    'withdraw': {
                        'BTC': 0.0004,
                        'BCH': 0.0001,
                        'ETH': 0.00135,
                        'EOS': 0.0,
                        'LTC': 0.001,
                        'OMG': 0.15097,
                        'IOT': 0.0,
                        'NEO': 0.0,
                        'ETC': 0.01,
                        'XRP': 0.02,
                        'ETP': 0.01,
                        'ZEC': 0.001,
                        'BTG': 0.0,
                        'DASH': 0.01,
                        'XMR': 0.0001,
                        'QTM': 0.01,
                        'EDO': 0.23687,
                        'DAT': 9.8858,
                        'AVT': 1.1251,
                        'SAN': 0.35977,
                        'USDT': 5.0,
                        'SPK': 16.971,
                        'BAT': 1.1209,
                        'GNT': 2.8789,
                        'SNT': 9.0848,
                        'QASH': 1.726,
                        'YYW': 7.9464,
                    },
                },
            },
            'options': {
                'orderTypes': {
                    'MARKET': undefined,
                    'EXCHANGE MARKET': 'market',
                    'LIMIT': undefined,
                    'EXCHANGE LIMIT': 'limit',
                    'STOP': undefined,
                    'EXCHANGE STOP': 'stopOrLoss',
                    'TRAILING STOP': undefined,
                    'EXCHANGE TRAILING STOP': undefined,
                    'FOK': undefined,
                    'EXCHANGE FOK': 'limit FOK',
                    'STOP LIMIT': undefined,
                    'EXCHANGE STOP LIMIT': 'limit stop',
                    'IOC': undefined,
                    'EXCHANGE IOC': 'limit ioc',
                },
                'fiat': {
                    'USD': 'USD',
                    'EUR': 'EUR',
                    'JPY': 'JPY',
                    'GBP': 'GBP',
                },
            },
        });
    }

    isFiat (code) {
        return (code in this.options['fiat']);
    }

    getCurrencyId (code) {
        return 'f' + code;
    }

    async fetchMarkets (params = {}) {
        let cacheData = await redisRead(this.id + '|markets');
        if (cacheData) return cacheData;
        else {
            let markets = await this.v1GetSymbolsDetails ();
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let id = market['pair'].toUpperCase ();
                let baseId = id.slice (0, 3);
                let quoteId = id.slice (3, 6);
                let base = this.commonCurrencyCode (baseId);
                let quote = this.commonCurrencyCode (quoteId);
                let symbol = base + '/' + quote;
                id = 't' + id;
                baseId = this.getCurrencyId (baseId);
                quoteId = this.getCurrencyId (quoteId);
                let precision = {
                    'price': market['price_precision'],
                    'amount': market['price_precision'],
                };
                let limits = {
                    'amount': {
                        'min': this.safeFloat (market, 'minimum_order_size'),
                        'max': this.safeFloat (market, 'maximum_order_size'),
                    },
                    'price': {
                        'min': Math.pow (10, -precision['price']),
                        'max': Math.pow (10, precision['price']),
                    },
                };
                limits['cost'] = {
                    'min': limits['amount']['min'] * limits['price']['min'],
                    'max': undefined,
                };
                result.push ({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'baseId': baseId,
                    'quoteId': quoteId,
                    'active': true,
                    'precision': precision,
                    'limits': limits,
                    'info': market,
                });
            }
            // Storing markets in Redis
            await redisWrite(this.id + '|markets', result, false, 60 * 60);
            return result;
        }
    }

    async fetchBalance (params = {}) {
        // this api call does not return the 'used' amount - use the v1 version instead (which also returns zero balances)
        await this.loadMarkets ();
        let response = await this.privatePostAuthRWallets ();
        let balanceType = this.safeString (params, 'type', 'exchange');
        let result = { 'info': response };
        for (let b = 0; b < response.length; b++) {
            let balance = response[b];
            let accountType = balance[0];
            let currency = balance[1];
            let total = balance[2];
            let available = balance[4];
            if (accountType === balanceType) {
                let code = currency;
                if (currency in this.currencies_by_id) {
                    code = this.currencies_by_id[currency]['code'];
                } else if (currency[0] === 't') {
                    currency = currency.slice (1);
                    code = currency.toUpperCase ();
                    code = this.commonCurrencyCode (code);
                } else {
                    code = this.commonCurrencyCode (code);
                }
                let account = this.account ();
                account['total'] = total;
                if (!available) {
                    if (available === 0) {
                        account['free'] = 0;
                        account['used'] = total;
                    } else {
                        account['free'] = total;
                    }
                } else {
                    account['free'] = available;
                    account['used'] = account['total'] - account['free'];
                }
                result[code] = account;
            }
        }
        return this.parseBalance (result);
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let orderbook = await this.publicGetBookSymbolPrecision (this.extend ({
            'symbol': this.marketId (symbol),
            'precision': 'R0',
        }, params));
        let timestamp = this.milliseconds ();
        let result = {
            'bids': [],
            'asks': [],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'nonce': undefined,
        };
        for (let i = 0; i < orderbook.length; i++) {
            let order = orderbook[i];
            let price = order[1];
            let amount = order[2];
            let side = (amount > 0) ? 'bids' : 'asks';
            amount = Math.abs (amount);
            result[side].push ([ price, amount ]);
        }
        result['bids'] = this.sortBy (result['bids'], 0, true);
        result['asks'] = this.sortBy (result['asks'], 0);
        return result;
    }

    parseTicker (ticker, market = undefined) {
        let timestamp = this.milliseconds ();
        let symbol = undefined;
        if (market)
            symbol = market['symbol'];
        let length = ticker.length;
        let last = ticker[length - 4];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': ticker[length - 2],
            'low': ticker[length - 1],
            'bid': ticker[length - 10],
            'bidVolume': undefined,
            'ask': ticker[length - 8],
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': ticker[length - 6],
            'percentage': ticker[length - 5] * 100,
            'average': undefined,
            'baseVolume': ticker[length - 3],
            'quoteVolume': undefined,
            'info': ticker,
        };
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        let request = {};
        if (symbols !== undefined) {
            let ids = this.marketIds (symbols);
            request['symbols'] = ids.join (',');
        } else {
            request['symbols'] = 'ALL';
        }
        let tickers = await this.publicGetTickers (this.extend (request, params));
        let result = {};
        for (let i = 0; i < tickers.length; i++) {
            let ticker = tickers[i];
            let id = ticker[0];
            if (id in this.markets_by_id) {
                let market = this.markets_by_id[id];
                let symbol = market['symbol'];
                result[symbol] = this.parseTicker (ticker, market);
            }
        }
        return result;
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        let market = this.market (symbol);
        let ticker = await this.publicGetTickerSymbol (this.extend ({
            'symbol': market['id'],
        }, params));
        return this.parseTicker (ticker, market);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchTrades (public)
        //
        //     [
        //         ID,
        //         MTS, // timestamp
        //         AMOUNT,
        //         PRICE
        //     ]
        //
        // fetchMyTrades (private)
        //
        //     [
        //         ID,
        //         PAIR,
        //         MTS_CREATE,
        //         ORDER_ID,
        //         EXEC_AMOUNT,
        //         EXEC_PRICE,
        //         ORDER_TYPE,
        //         ORDER_PRICE,
        //         MAKER,
        //         FEE,
        //         FEE_CURRENCY,
        //         ...
        //     ]
        //
        const tradeLength = trade.length;
        const isPrivate = (tradeLength > 5);
        const id = trade[0].toString ();
        const amountIndex = isPrivate ? 4 : 2;
        let amount = trade[amountIndex];
        let cost = undefined;
        const priceIndex = isPrivate ? 5 : 3;
        const price = trade[priceIndex];
        let side = undefined;
        let orderId = undefined;
        let takerOrMaker = undefined;
        let type = undefined;
        let fee = undefined;
        let symbol = undefined;
        const timestampIndex = isPrivate ? 2 : 1;
        const timestamp = trade[timestampIndex];
        if (isPrivate) {
            const marketId = trade[1];
            if (marketId !== undefined) {
                if (marketId in this.markets_by_id) {
                    market = this.markets_by_id[marketId];
                    symbol = market['symbol'];
                } else {
                    symbol = marketId;
                }
            }
            orderId = trade[3];
            takerOrMaker = (trade[8] === 1) ? 'maker' : 'taker';
            const feeCost = trade[9];
            const feeCurrency = this.commonCurrencyCode (trade[10]);
            if (feeCost !== undefined) {
                fee = {
                    'cost': Math.abs (feeCost),
                    'currency': feeCurrency,
                };
            }
            const orderType = trade[6];
            type = this.safeString (this.options['orderTypes'], orderType);
        }
        if (symbol === undefined) {
            if (market !== undefined) {
                symbol = market['symbol'];
            }
        }
        if (amount !== undefined) {
            side = (amount < 0) ? 'sell' : 'buy';
            amount = Math.abs (amount);
            if (cost === undefined) {
                if (price !== undefined) {
                    cost = amount * price;
                }
            }
        }
        return {
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'order': orderId,
            'side': side,
            'type': type,
            'takerOrMaker': takerOrMaker,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': fee,
            'info': trade,
        };
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let market = this.market (symbol);
        let sort = '-1';
        let request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['start'] = since;
            sort = '1';
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 120, max 5000
        }
        request['sort'] = sort;
        let response = await this.publicGetTradesSymbolHist (this.extend (request, params));
        //
        //     [
        //         [
        //             ID,
        //             MTS, // timestamp
        //             AMOUNT,
        //             PRICE
        //         ]
        //     ]
        //
        let trades = this.sortBy (response, 1);
        return this.parseTrades (trades, market, undefined, limit);
    }

    async fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = 100, params = {}) {
        await this.loadMarkets ();
        let market = this.market (symbol);
        if (limit === undefined) {
            limit = 100; // default 100, max 5000
        }
        if (since === undefined) {
            since = this.milliseconds () - this.parseTimeframe (timeframe) * limit * 1000;
        }
        let request = {
            'symbol': market['id'],
            'timeframe': this.timeframes[timeframe],
            'sort': 1,
            'start': since,
            'limit': limit,
        };
        let response = await this.publicGetCandlesTradeTimeframeSymbolHist (this.extend (request, params));
        return this.parseOHLCVs (response, market, timeframe, since, limit);
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        throw new NotSupported (this.id + ' createOrder not implemented yet');
    }

    cancelOrder (id, symbol = undefined, params = {}) {
        throw new NotSupported (this.id + ' cancelOrder not implemented yet');
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        throw new NotSupported (this.id + ' fetchOrder not implemented yet');
    }

    async fetchDepositAddress (currency, params = {}) {
        throw new NotSupported (this.id + ' fetchDepositAddress() not implemented yet.');
    }

    async withdraw (code, amount, address, tag = undefined, params = {}) {
        throw new NotSupported (this.id + ' withdraw not implemented yet');
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        // this.has['fetchMyTrades'] is set to false
        // https://github.com/ccxt/ccxt/issues/4971
        await this.loadMarkets ();
        let market = undefined;
        let request = {
            'end': this.milliseconds (),
        };
        if (since !== undefined) {
            request['start'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 25, max 1000
        }
        let method = 'privatePostAuthRTradesHist';
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
            method = 'privatePostAuthRTradesSymbolHist';
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     [
        //         [
        //             ID,
        //             PAIR,
        //             MTS_CREATE,
        //             ORDER_ID,
        //             EXEC_AMOUNT,
        //             EXEC_PRICE,
        //             ORDER_TYPE,
        //             ORDER_PRICE,
        //             MAKER,
        //             FEE,
        //             FEE_CURRENCY,
        //             ...
        //         ],
        //         ...
        //     ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    async fetchDeposits(symbol = undefined, since = undefined, limit = 25, params = {}) {

      let response = await this.privatePostAuthRMovementsHist(this.extend(params));
      let result = [];
      response.map((k) => {
        if (k[9] == 'COMPLETED' && k[12] > 0) {
          let obj = { currency: k[1], timestamp: k[6], amount: k[12], status: k[9], txid: k[20], address: k[16], fee:{cost: k[13], currency: k[1] } };
          result.push(obj);
        }
      });
      // return this.parseTrades (response, market, since, limit); // not implemented yet for bitfinex v2
      return result
    }

    async fetchWithdrawals(symbol = undefined, since = undefined, limit = 25, params = {}) {

      let response = await this.privatePostAuthRMovementsHist(this.extend(params));
      let result = [];
      response.map((k) => {
        if (k[9] == 'COMPLETED' && k[12] < 0) {
          let obj = { currency: k[1], timestamp: k[6], amount: -k[12], status: k[9], txid: k[20], address: k[16], fee:{cost: -k[13], currency: k[1] } };
          result.push(obj);
        }
      });
      // return this.parseTrades (response, market, since, limit); // not implemented yet for bitfinex v2
      return result
    }

    nonce () {
        return this.microseconds () * 100000;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/' + this.implodeParams (path, params);
        let query = this.omit (params, this.extractParams (path));
        if (api === 'v1')
            request = api + request;
        else
            request = this.version + request;
        let url = this.urls['api'][api] + '/' + request;
        if (api === 'public') {
            if (Object.keys (query).length) {
                url += '?' + this.urlencode (query);
            }
        }
        if (api === 'private') {
            this.checkRequiredCredentials ();
            let nonce = this.nonce ().toString ();
            body = this.json (query);
            let auth = '/api/' + request + nonce + body;
            let signature = this.hmac (this.encode (auth), this.encode (this.secret), 'sha384');
            headers = {
                'bfx-nonce': nonce,
                'bfx-apikey': this.apiKey,
                'bfx-signature': signature,
                'Content-Type': 'application/json',
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    async request (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let response = await this.fetch2 (path, api, method, params, headers, body);
        if (response) {
            if ('message' in response) {
                if (response['message'].indexOf ('not enough exchange balance') >= 0)
                    throw new InsufficientFunds (this.id + ' ' + this.json (response));
                throw new ExchangeError (this.id + ' ' + this.json (response));
            }
            return response;
        } else if (response === '') {
            throw new ExchangeError (this.id + ' returned empty response');
        }
        return response;
    }
};
