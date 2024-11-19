import {expect, test} from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";

test(`[${config.name.toUpperCase()}] GET /api/v1/toplists/{id}/results`, async ({request}, testInfo) => {
    const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v1/toplists/6719ffdfd4372e0607af539a/results`, {
        headers: {
            // Add headers if needed
        },
        params: {
            // Add query params if needed
        },
        data: {
            // Add body data if needed
        }
    });

    await logResponse(response, testInfo);

    expect(response.status()).toBe(200); // Customize based on the expected status code
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(
        {
            "sites": [{
                "id": "65f49a7e06037feabc1910ad",
                "name": "Dunder Casino",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2020/10/dunder-logo.png"},
                "landingPageUrl": "https://www.dunder.com/",
                "finalRating": 3.49,
                "welcomeOffer": "",
                "licenses": ["Malta", "Royaume-Uni"],
                "yearFounded": 2016,
                "TC": "https://www.dunder.com/terms-and-conditions",
                "tableDesign": "",
                "casinoProducts": ["Baccarat", "Bingo", "Blackjack", "Craps", "Crash", "Dice", "Financial", "HiLo", "Jackpot", "Keno", "Limbo", "Live Dealer", "Lotteries", "Mines", "Plinko", "Poker", "Roulette", "Scratchcards", "Slots", "Video Poker"],
                "numberCasinoGames": 1000,
                "languages": ["English", "German", "Norwegian", "Finnish"],
                "supportLanguages": ["English"],
                "playWithFiat": [{
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "Canadian dollar",
                    "iso": "CAD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "New Zealand dollar",
                    "iso": "NZD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Norwegian krone",
                    "iso": "NOK",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2020/10/dunder-casino-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2020/10/dunder-casino-review-m.png"},
                "position": 1
            }, {
                "id": "65f49a8006037feabc1a57a0",
                "name": "Ditobet",
                "description": "<p>Ditobet is a highly-regarded brand launched in 2021 by Dito Capital N.V..<br />\nBased in Curaçao, it provides a satisfactory range of gambling options and protects users with security features such as SSL Encryption.<br />\nDitobet allows you to play with 17 currencies once the registration process is completed.<br />\nAs the options include digital currencies, you have the potential to enjoy privacy when you gamble.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2022/04/Ditobet-logo.png"},
                "landingPageUrl": "https://sshortly.net/SwcDea",
                "finalRating": 4.38,
                "welcomeOffer": "Up to 1000 USD Welcome Package + 100 Free Spins",
                "licenses": ["Curaçao"],
                "yearFounded": 2021,
                "TC": "https://m.ditobet.com/en/?helpPageContent=20164",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 3000,
                "languages": ["English", "German", "Norwegian", "Finnish", "Slovak", "French", "Spanish", "Portuguese", "Russian", "Turkish", "Czech"],
                "supportLanguages": ["English"],
                "playWithFiat": [{
                    "name": "United States Dollar",
                    "iso": "USD",
                    "image": {"url": "/wp-content/uploads/2020/07/usd.svg"}
                }, {
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "British pound",
                    "iso": "GBP",
                    "image": {"url": "/wp-content/uploads/2020/07/gbp.svg"}
                }, {
                    "name": "Russian ruble",
                    "iso": "RUB",
                    "image": {"url": "/wp-content/uploads/2020/07/rub.svg"}
                }, {
                    "name": "Canadian dollar",
                    "iso": "CAD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Mexican peso",
                    "iso": "MXN",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Indian rupee",
                    "iso": "INR",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Turkish lira",
                    "iso": "TRY",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Brazilian real",
                    "iso": "BRL",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Chilean peso",
                    "iso": "CLP",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Peruvian sol",
                    "iso": "PEN",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [{
                    "name": "Bitcoin",
                    "iso": "BTC",
                    "image": {"url": "/wp-content/uploads/2021/06/bitcoin-btc.svg"}
                }, {
                    "name": "Ethereum",
                    "iso": "ETH",
                    "image": {"url": "/wp-content/uploads/2021/06/ethereum-eth.svg"}
                }, {
                    "name": "Tether",
                    "iso": "USDT",
                    "image": {"url": "/wp-content/uploads/2021/06/tether.svg"}
                }, {
                    "name": "XRP",
                    "iso": "XRP",
                    "image": {"url": "/wp-content/uploads/2021/06/xrp.svg"}
                }, {
                    "name": "OmiseGo",
                    "iso": "OMG",
                    "image": {"url": "/wp-content/uploads/2021/06/omg-network.svg"}
                }, {
                    "name": "Mithril",
                    "iso": "MITH",
                    "image": {"url": "/wp-content/uploads/2021/06/mithril-mith.svg"}
                }, {
                    "name": "Metal",
                    "iso": "MTL",
                    "image": {"url": "/wp-content/uploads/2021/06/metal-mtl.svg"}
                }, {
                    "name": "Aion",
                    "iso": "AION",
                    "image": {"url": "/wp-content/uploads/2021/06/aion.svg"}
                }, {
                    "name": "FunFair",
                    "iso": "FUN",
                    "image": {"url": "/wp-content/uploads/2021/06/funfair-fun.svg"}
                }, {
                    "name": "Augur",
                    "iso": "REP",
                    "image": {"url": "/wp-content/uploads/2021/06/augur.svg"}
                }, {
                    "name": "Bancor",
                    "iso": "BNT",
                    "image": {"url": "/wp-content/uploads/2021/06/bancor-network-token-bnt.svg"}
                }, {
                    "name": "Enjin Coin",
                    "iso": "ENJ",
                    "image": {"url": "/wp-content/uploads/2021/06/enjin-coin-enj.svg"}
                }, {
                    "name": "Litecoin",
                    "iso": "LTC",
                    "image": {"url": "/wp-content/uploads/2021/06/litecoin-ltc.svg"}
                }, {
                    "name": "Zilliqa",
                    "iso": "ZIL",
                    "image": {"url": "/wp-content/uploads/2021/06/zilliqa.svg"}
                }, {
                    "name": "Bitcoin Cash",
                    "iso": "BCH",
                    "image": {"url": "/wp-content/uploads/2021/06/bitcoin-cash-bch.svg"}
                }, {
                    "name": "Chainlink",
                    "iso": "LINK",
                    "image": {"url": "/wp-content/uploads/2021/06/chainlink.svg"}
                }, {"name": "carVertical", "iso": "CV", "image": {"url": "/wp-content/uploads/2021/06/2450.png"}}],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2022/04/ditobet-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2022/04/ditobet-review-m.png"},
                "position": 2
            }, {
                "id": "65f49a7f06037feabc1a1f96",
                "name": "Duelbits",
                "description": "<p>According to some users, Duelbits is a dependable site; it was founded in 2020 by Liquid Gaming N.V..<br />\nBased in Curaçao, it provides a satisfactory range of gambling options and protects users with security features such as SSL Encryption, 2FA.<br />\nOnce you register with Duelbits, you have the chance to use one of 6 currencies.<br />\nThe available cryptocurrencies mean you could find a solid payment option if you want anonymity while playing.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2022/03/Duelbits-logo.png"},
                "landingPageUrl": "https://affiliates.duelbits.com/visit/?bta=35112&brand=duelbits",
                "finalRating": 4.42,
                "welcomeOffer": "No Bonus Available",
                "licenses": ["Curaçao"],
                "yearFounded": 2020,
                "TC": "https://duelbits.com/tos",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 1000,
                "languages": ["English"],
                "supportLanguages": ["English"],
                "playWithFiat": [],
                "depositMethodsCrypto": [{
                    "name": "Bitcoin",
                    "iso": "BTC",
                    "image": {"url": "/wp-content/uploads/2021/06/bitcoin-btc.svg"}
                }, {
                    "name": "Ethereum",
                    "iso": "ETH",
                    "image": {"url": "/wp-content/uploads/2021/06/ethereum-eth.svg"}
                }, {
                    "name": "Solana",
                    "iso": "SOL",
                    "image": {"url": "/wp-content/uploads/2021/06/solana.svg"}
                }, {
                    "name": "Dogecoin",
                    "iso": "DOGE",
                    "image": {"url": "/wp-content/uploads/2021/05/dogecoin-doge.svg"}
                }, {
                    "name": "Litecoin",
                    "iso": "LTC",
                    "image": {"url": "/wp-content/uploads/2021/06/litecoin-ltc.svg"}
                }, {
                    "name": "Bitcoin Cash",
                    "iso": "BCH",
                    "image": {"url": "/wp-content/uploads/2021/06/bitcoin-cash-bch.svg"}
                }],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2022/03/duelbits-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2022/03/duelbits-review-m.png"},
                "position": 3
            }, {
                "id": "65f49a7f06037feabc1a0581",
                "name": "4StarsGames",
                "description": "<p>4StarsGames is a highly-regarded brand launched in 2019 by Soar Malta.<br />\nLocated in Malta, it has some neat security features, such as SSL Encryption, and provides plenty of opportunities to gamble.<br />\nAfter registering with 4StarsGames, you’ll find that you can play with 0 different currencies.<br />\nAs the options include digital currencies, you have the potential to enjoy privacy when you gamble.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2022/01/4-Stars-Games-logo.png"},
                "landingPageUrl": "https://www.4starsgames.com/en",
                "finalRating": 4.34,
                "welcomeOffer": "Up to 100 EUR Welcome Package",
                "licenses": ["Malta"],
                "yearFounded": 2019,
                "TC": "https://www.4starsgames.com/en",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 1500,
                "languages": ["English", "Greek", "German", "Spanish"],
                "supportLanguages": ["English", "German", "Spanish", "Greek"],
                "playWithFiat": [{
                    "name": "United States Dollar",
                    "iso": "USD",
                    "image": {"url": "/wp-content/uploads/2020/07/usd.svg"}
                }, {
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "Canadian dollar",
                    "iso": "CAD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "New Zealand dollar",
                    "iso": "NZD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Indian rupee",
                    "iso": "INR",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "South African rand",
                    "iso": "ZAR",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Peruvian sol",
                    "iso": "PEN",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2022/01/4starsgames-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2022/01/4starsgames-review-m.png"},
                "position": 4
            }, {
                "id": "65f49a8206037feabc1b4878",
                "name": "500 Casino",
                "description": "<p>Introduced to the marketplace in 2016 by Perfect Storm B.V., 500 Casino is considered a trustworthy company by many players.<br />\nWith its HQ in Curaçao, the site has security features such as SSL Encryption, 2FA and a decent selection of gambling opportunities.<br />\n500 Casino allows you to play with 15 currencies once the registration process is completed.<br />\nTherefore, you’ll hopefully find the right payment method for your needs, with digital currencies among the options.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2022/08/500-casino-review-1.png"},
                "landingPageUrl": "https://500.casino/r/REF91570WBE81OJI",
                "finalRating": 4.42,
                "welcomeOffer": "Up to 1000 USD Welcome Package",
                "licenses": ["Curaçao"],
                "yearFounded": 2016,
                "TC": "https://500play.com/terms-of-service",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 4000,
                "languages": ["English", "German", "Russian", "Spanish", "Danish", "Polish", "Portuguese", "Romanian", "Swedish", "Turkish"],
                "supportLanguages": ["English"],
                "playWithFiat": [{
                    "name": "United States Dollar",
                    "iso": "USD",
                    "image": {"url": "/wp-content/uploads/2020/07/usd.svg"}
                }, {
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "British pound",
                    "iso": "GBP",
                    "image": {"url": "/wp-content/uploads/2020/07/gbp.svg"}
                }, {
                    "name": "Japanese yen",
                    "iso": "JPY",
                    "image": {"url": "/wp-content/uploads/2020/07/jpy.svg"}
                }, {
                    "name": "Russian ruble",
                    "iso": "RUB",
                    "image": {"url": "/wp-content/uploads/2020/07/rub.svg"}
                }, {
                    "name": "Chinese yuan",
                    "iso": "CNY",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Turkish lira",
                    "iso": "TRY",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Brazilian real",
                    "iso": "BRL",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Danish krone",
                    "iso": "DKK",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Polish złoty",
                    "iso": "PLN",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [{
                    "name": "Bitcoin",
                    "iso": "BTC",
                    "image": {"url": "/wp-content/uploads/2021/06/bitcoin-btc.svg"}
                }, {
                    "name": "Ethereum",
                    "iso": "ETH",
                    "image": {"url": "/wp-content/uploads/2021/06/ethereum-eth.svg"}
                }, {
                    "name": "Tether",
                    "iso": "USDT",
                    "image": {"url": "/wp-content/uploads/2021/06/tether.svg"}
                }, {
                    "name": "Binance Coin",
                    "iso": "BNB",
                    "image": {"url": "/wp-content/uploads/2021/06/binance-coin-bnb.svg"}
                }, {
                    "name": "XRP",
                    "iso": "XRP",
                    "image": {"url": "/wp-content/uploads/2021/06/xrp.svg"}
                }, {
                    "name": "Cardano",
                    "iso": "ADA",
                    "image": {"url": "/wp-content/uploads/2021/06/cardano-ada.svg"}
                }, {
                    "name": "Solana",
                    "iso": "SOL",
                    "image": {"url": "/wp-content/uploads/2021/06/solana.svg"}
                }, {
                    "name": "Avalanche",
                    "iso": "AVAX",
                    "image": {"url": "/wp-content/uploads/2021/06/avalanche-avax.svg"}
                }, {
                    "name": "Dogecoin",
                    "iso": "DOGE",
                    "image": {"url": "/wp-content/uploads/2021/05/dogecoin-doge.svg"}
                }, {
                    "name": "Litecoin",
                    "iso": "LTC",
                    "image": {"url": "/wp-content/uploads/2021/06/litecoin-ltc.svg"}
                }, {
                    "name": "Bitcoin Cash",
                    "iso": "BCH",
                    "image": {"url": "/wp-content/uploads/2021/06/bitcoin-cash-bch.svg"}
                }, {
                    "name": "Stellar",
                    "iso": "XLM",
                    "image": {"url": "/wp-content/uploads/2021/06/stellar.svg"}
                }, {
                    "name": "EOS",
                    "iso": "EOS",
                    "image": {"url": "/wp-content/uploads/2021/06/eos.svg"}
                }, {
                    "name": "TRON",
                    "iso": "TRX",
                    "image": {"url": "/wp-content/uploads/2021/06/tron.svg"}
                }, {
                    "name": "Polygon",
                    "iso": "MATIC",
                    "image": {"url": "/wp-content/uploads/2021/06/polygon-matic.svg"}
                }],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2022/08/500-casino-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2022/08/500-casino-review-2.png"},
                "position": 5
            }, {
                "id": "65f49a8006037feabc1a3ce1",
                "name": "666 Casino",
                "description": "<p>Introduced to the marketplace in 2017 by White Hat Gaming, 666 Casino is considered a trustworthy company by many players.<br />\nWith security features including SSL Encryption and a nice array of gambling options, this Malta-based site is well worth a visit.<br />\nOnce you register with 666 Casino, you have the chance to use one of 0 currencies.<br />\nThis makes it likely that you’ll find the right payment option with cryptocurrencies now proving popular with many players.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2022/03/666casino-logo.png"},
                "landingPageUrl": "https://www.666casino.com",
                "finalRating": 4.55,
                "welcomeOffer": "Up to 1998 CAD Welcome Package + 66 Free Spins",
                "licenses": ["United Kingdom", "Malta"],
                "yearFounded": 2017,
                "TC": "https://www.666casino.com/terms",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 1000,
                "languages": ["English", "German", "Finnish", "Norwegian", "Spanish", "Portuguese"],
                "supportLanguages": ["English", "German", "Norwegian", "Swedish"],
                "playWithFiat": [{
                    "name": "United States Dollar",
                    "iso": "USD",
                    "image": {"url": "/wp-content/uploads/2020/07/usd.svg"}
                }, {
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "British pound",
                    "iso": "GBP",
                    "image": {"url": "/wp-content/uploads/2020/07/gbp.svg"}
                }, {
                    "name": "Canadian dollar",
                    "iso": "CAD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "New Zealand dollar",
                    "iso": "NZD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Norwegian krone",
                    "iso": "NOK",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Indian rupee",
                    "iso": "INR",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Brazilian real",
                    "iso": "BRL",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Chilean peso",
                    "iso": "CLP",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Argentine peso",
                    "iso": "ARS",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Peruvian sol",
                    "iso": "PEN",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2022/03/666-casino-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2022/03/666-casino-review-m.png"},
                "position": 6
            }, {
                "id": "65f49a7e06037feabc1969d2",
                "name": "777 Casino",
                "description": "<p>Introduced to the marketplace in 2015 by 888 Holdings, 777 Casino is considered a trustworthy company by many players.<br />\nWith its HQ in Gibraltar, the site has security features such as SSL Encryption and a decent selection of gambling opportunities.<br />\nOnce you register with 777 Casino, you have the chance to use one of 0 currencies.<br />\nThe available cryptocurrencies mean you could find a solid payment option if you want anonymity while playing.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2021/07/777-casino-logo.png"},
                "landingPageUrl": "https://www.777.com/",
                "finalRating": 4.16,
                "welcomeOffer": "Up to 1500 USD Welcome Package",
                "licenses": ["Gibraltar", "United Kingdom"],
                "yearFounded": 2015,
                "TC": "https://play-www.777.com/security-and-privacy/user-agreement-uk/",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 500,
                "languages": ["English", "Finnish", "German", "Norwegian"],
                "supportLanguages": ["English", "German", "Finnish"],
                "playWithFiat": [{
                    "name": "United States Dollar",
                    "iso": "USD",
                    "image": {"url": "/wp-content/uploads/2020/07/usd.svg"}
                }, {
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {"name": "British pound", "iso": "GBP", "image": {"url": "/wp-content/uploads/2020/07/gbp.svg"}}],
                "depositMethodsCrypto": [],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2021/07/777-casino-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2021/07/777-casino-review-m.png"},
                "position": 7
            }, {
                "id": "65f49a7e06037feabc195c81",
                "name": "Avalon78 Casino",
                "description": "<p>Founded in 2019 by N1 Interactive, Avalon78 Casino is generally considered one of the most reputable sites around.<br />\nLocated in Malta, it has some neat security features, such as SSL Encryption, Random Number Generation (RNG), and provides plenty of opportunities to gamble.<br />\nAfter registering with Avalon78 Casino, you’ll find that you can play with 0 different currencies.<br />\nAs the options include digital currencies, you have the potential to enjoy privacy when you gamble.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2021/06/Avalon78-Casino-logo.png"},
                "landingPageUrl": "https://www.avalon78.com/",
                "finalRating": 4.25,
                "welcomeOffer": "Up to 250 USD Welcome Package + 150 Free Spins",
                "licenses": ["Malta"],
                "yearFounded": 2019,
                "TC": "https://www.avalon78.com/terms-and-conditions",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 9,
                "languages": ["English", "German", "Polish", "Norwegian", "Finnish", "Russian"],
                "supportLanguages": ["English", "German", "Russian"],
                "playWithFiat": [{
                    "name": "United States Dollar",
                    "iso": "USD",
                    "image": {"url": "/wp-content/uploads/2020/07/usd.svg"}
                }, {
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "Russian ruble",
                    "iso": "RUB",
                    "image": {"url": "/wp-content/uploads/2020/07/rub.svg"}
                }, {
                    "name": "Canadian dollar",
                    "iso": "CAD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "New Zealand dollar",
                    "iso": "NZD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Norwegian krone",
                    "iso": "NOK",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Polish złoty",
                    "iso": "PLN",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2021/06/avalon78-casino-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2021/06/avalon78-casino-review-m.png"},
                "position": 8
            }, {
                "id": "65f49a7e06037feabc19669e",
                "name": "Wildz Casino",
                "description": "<p>Wildz Casino is a brand with a solid reputation founded in 2019 by Rootz.<br />\nBased in Malta, it provides a satisfactory range of gambling options and protects users with security features such as SSL Encryption.<br />\nOnce you register with Wildz Casino, you have the chance to use one of 0 currencies.<br />\nAs such, you should find a payment method that suits you, including crypto options that enable greater privacy.</p>\n",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2021/07/wildz-logo.png"},
                "landingPageUrl": "https://www.wildz.com/en/",
                "finalRating": 4.32,
                "welcomeOffer": "Up to 500 EUR Welcome Package + 200 Free Spins",
                "licenses": ["Malta"],
                "yearFounded": 2019,
                "TC": "https://www.wildz.com/en/info/terms-and-conditions/",
                "tableDesign": "",
                "casinoProducts": ["Slots", "Video Poker", "Live Dealer", "Blackjack", "Baccarat", "Bingo", "Keno", "Roulette", "Lotteries", "Craps", "Scratchcards", "Poker", "Dice", "Crash", "Mines", "Plinko", "HiLo", "Limbo", "Financial", "Jackpot", "Slingo"],
                "numberCasinoGames": 1200,
                "languages": ["English", "Finnish", "French", "Japanese", "German", "Norwegian"],
                "supportLanguages": ["English", "French", "German", "Finnish", "Japanese", "Norwegian"],
                "playWithFiat": [{
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "Japanese yen",
                    "iso": "JPY",
                    "image": {"url": "/wp-content/uploads/2020/07/jpy.svg"}
                }, {
                    "name": "Canadian dollar",
                    "iso": "CAD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Norwegian krone",
                    "iso": "NOK",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2021/07/wildz-casino-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2021/07/wildz-casino-review-m.png"},
                "position": 9
            }, {
                "id": "65f49a8206037feabc1b6164",
                "name": "10Bet",
                "featuredSnippet": "",
                "logo": {"url": "/wp-content/uploads/2021/03/10Bet-logo.png"},
                "landingPageUrl": "https://www.10bet.com/casino",
                "finalRating": 3.15,
                "welcomeOffer": "",
                "licenses": ["Malta", "United Kingdom", "Sweden"],
                "yearFounded": 2003,
                "TC": "https://www.10bet.com/casino",
                "tableDesign": "",
                "casinoProducts": ["Baccarat", "Bingo", "Blackjack", "Craps", "Crash", "Dice", "Financial", "HiLo", "Jackpot", "Keno", "Limbo", "Live Dealer", "Lotteries", "Mines", "Plinko", "Poker", "Roulette", "Scratchcards", "Slots", "Video Poker"],
                "numberCasinoGames": 7,
                "languages": ["English", "German", "Norwegian", "Swedish"],
                "supportLanguages": ["English", "Swedish"],
                "playWithFiat": [{
                    "name": "United States Dollar",
                    "iso": "USD",
                    "image": {"url": "/wp-content/uploads/2020/07/usd.svg"}
                }, {
                    "name": "Euro",
                    "iso": "EUR",
                    "image": {"url": "/wp-content/uploads/2020/07/eur.svg"}
                }, {
                    "name": "British pound",
                    "iso": "GBP",
                    "image": {"url": "/wp-content/uploads/2020/07/gbp.svg"}
                }, {
                    "name": "Canadian dollar",
                    "iso": "CAD",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Swedish krona",
                    "iso": "SEK",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Norwegian krone",
                    "iso": "NOK",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Brazilian real",
                    "iso": "BRL",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Malaysian ringgit",
                    "iso": "MYR",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }, {
                    "name": "Vietnamese đồng",
                    "iso": "VND",
                    "image": {"url": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="}
                }],
                "depositMethodsCrypto": [],
                "homepageImageDesktop": {"url": "/wp-content/uploads/2021/03/10bet-review.png"},
                "homepageImageMobile": {"url": "/wp-content/uploads/2021/03/10bet-review-m.png"},
                "position": 10
            }]
        }
    );
});
