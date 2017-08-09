/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('assert');
const Mnemonic = require('../lib/hd/mnemonic');
const HDPrivateKey = require('../lib/hd/private');

const tests = {
  english: require('./data/mnemonic-english.json'),
  japanese: require('./data/mnemonic-japanese.json')
};

describe('Mnemonic', function() {
  for (const lang of Object.keys(tests)) {
    const test = tests[lang];
    let i = 0;

    for (const data of test) {
      const entropy = Buffer.from(data[0], 'hex');
      const phrase = data[1];
      const passphrase = data[2];
      const seed = Buffer.from(data[3], 'hex');
      const xpriv = data[4];
      it(`should create a ${lang} mnemonic (${i++})`, () => {
        const mnemonic = new Mnemonic({
          language: lang,
          entropy: entropy,
          passphrase: passphrase
        });

        assert.strictEqual(mnemonic.getPhrase(), phrase);
        assert.deepStrictEqual(mnemonic.toSeed(), seed);

        const key = HDPrivateKey.fromMnemonic(mnemonic);
        assert.strictEqual(key.toBase58(), xpriv);
      });
    }
  }

  it('should verify phrase', () => {
    const m1 = new Mnemonic();
    const m2 = Mnemonic.fromPhrase(m1.getPhrase());
    assert.deepStrictEqual(m2.getEntropy(), m1.getEntropy());
    assert.strictEqual(m2.bits, m1.bits);
    assert.strictEqual(m2.language, m1.language);
    assert.deepStrictEqual(m2.toSeed(), m1.toSeed());
  });
});
