/**
 * Tests for TWT CoinMarketCap link addition and related changes.
 *
 * Validates the info.json files modified in this PR:
 * - CoinMarketCap link added to TWT tokens across Binance, BSC, and Solana chains
 * - Spam token entry for BSC
 * - Deleted asset logos
 *
 * Run with: node --test internal/info/twt_info_test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

// --- Validation constants (mirrors Go values.go) ---

const ALLOWED_STATUS_VALUES = ['active', 'spam', 'abandoned'];

const REQUIRED_ASSET_FIELDS = [
  'name', 'type', 'symbol', 'decimals',
  'description', 'website', 'explorer', 'status', 'id',
];

const ALLOWED_LINK_KEYS = {
  github: 'https://github.com/',
  whitepaper: '',
  x: 'https://x.com/',
  telegram: 'https://t.me/',
  telegram_news: 'https://t.me/',
  medium: '',
  discord: 'https://discord.com/',
  reddit: 'https://reddit.com/',
  facebook: 'https://facebook.com/',
  youtube: 'https://youtube.com/',
  coinmarketcap: 'https://coinmarketcap.com/',
  coingecko: 'https://coingecko.com/',
  blog: '',
  forum: '',
  docs: '',
  source_code: '',
};

// --- Helper functions ---

function loadInfoJSON(relPath) {
  const fullPath = resolve(REPO_ROOT, relPath);
  const raw = readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw);
}

function validateRequiredAssetFields(info) {
  const missing = REQUIRED_ASSET_FIELDS.filter((f) => {
    const val = info[f];
    if (val === undefined || val === null) return true;
    if (typeof val === 'string' && val === '') return true;
    return false;
  });
  return missing;
}

function validateLinks(links) {
  const errors = [];
  if (!links || links.length < 2) return errors;

  for (const link of links) {
    if (!link.name || !link.url) {
      errors.push('missing required fields links.url and links.name');
      continue;
    }

    if (!(link.name in ALLOWED_LINK_KEYS)) {
      errors.push(`invalid link name: "${link.name}"`);
      continue;
    }

    const prefix = ALLOWED_LINK_KEYS[link.name];
    if (prefix && !link.url.startsWith(prefix)) {
      errors.push(`invalid prefix for ${link.name}: "${link.url}", expected prefix: "${prefix}"`);
    }

    if (!link.url.startsWith('https://')) {
      errors.push(`link "${link.name}" URL does not use HTTPS: "${link.url}"`);
    }

    if (link.name === 'medium' && !link.url.includes('medium.com')) {
      errors.push(`medium link URL should contain medium.com: "${link.url}"`);
    }
  }

  return errors;
}

function validateStatus(status) {
  return ALLOWED_STATUS_VALUES.includes(status);
}

function validateDescription(description) {
  if (description.length > 600) return 'description exceeds 600 characters';
  if (description.includes('\n')) return 'description contains newline';
  if (description.includes('  ')) return 'description contains double space';
  return null;
}

function validateDecimals(decimals) {
  return decimals >= 0 && decimals <= 30;
}

// --- TWT info.json paths ---

const TWT_FILES = [
  'blockchains/binance/assets/TWT-8C2/info.json',
  'blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json',
  'blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json',
];

const EXPECTED_CMC_URL = 'https://coinmarketcap.com/currencies/trust-wallet-token/';

// --- Tests ---

describe('TWT info.json - Valid JSON', () => {
  for (const f of TWT_FILES) {
    it(`${f} should be valid JSON`, () => {
      const fullPath = resolve(REPO_ROOT, f);
      const raw = readFileSync(fullPath, 'utf-8');
      assert.doesNotThrow(() => JSON.parse(raw), `File ${f} contains invalid JSON`);
    });
  }
});

describe('TWT info.json - Required fields', () => {
  for (const f of TWT_FILES) {
    it(`${f} should have all required fields`, () => {
      const info = loadInfoJSON(f);
      const missing = validateRequiredAssetFields(info);
      assert.deepStrictEqual(missing, [], `Missing required fields: ${missing.join(', ')}`);
    });
  }
});

describe('TWT info.json - CoinMarketCap link', () => {
  for (const f of TWT_FILES) {
    it(`${f} should contain coinmarketcap link`, () => {
      const info = loadInfoJSON(f);
      assert.ok(Array.isArray(info.links), 'links field should be an array');

      const cmcLink = info.links.find((l) => l.name === 'coinmarketcap');
      assert.ok(cmcLink, 'coinmarketcap link not found in links array');
      assert.strictEqual(cmcLink.url, EXPECTED_CMC_URL,
        `coinmarketcap URL should be ${EXPECTED_CMC_URL}`);
    });

    it(`${f} coinmarketcap link should have correct prefix`, () => {
      const info = loadInfoJSON(f);
      const cmcLink = info.links.find((l) => l.name === 'coinmarketcap');
      assert.ok(cmcLink, 'coinmarketcap link not found');
      assert.ok(cmcLink.url.startsWith('https://coinmarketcap.com/'),
        'coinmarketcap URL should start with https://coinmarketcap.com/');
    });
  }
});

describe('TWT info.json - Links validation', () => {
  for (const f of TWT_FILES) {
    it(`${f} should have valid links`, () => {
      const info = loadInfoJSON(f);
      const errors = validateLinks(info.links);
      assert.deepStrictEqual(errors, [], `Link validation errors: ${errors.join('; ')}`);
    });
  }
});

describe('TWT info.json - Status validation', () => {
  for (const f of TWT_FILES) {
    it(`${f} should have valid status`, () => {
      const info = loadInfoJSON(f);
      assert.ok(validateStatus(info.status),
        `Invalid status: "${info.status}", allowed: ${ALLOWED_STATUS_VALUES.join(', ')}`);
    });
  }
});

describe('TWT info.json - Description validation', () => {
  for (const f of TWT_FILES) {
    it(`${f} should have valid description`, () => {
      const info = loadInfoJSON(f);
      const err = validateDescription(info.description);
      assert.strictEqual(err, null, `Description validation error: ${err}`);
    });
  }
});

describe('TWT info.json - Decimals validation', () => {
  const expectedDecimals = {
    'blockchains/binance/assets/TWT-8C2/info.json': { type: 'BEP2', decimals: 8 },
    'blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json': { type: 'BEP20', decimals: 18 },
    'blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json': { type: 'SPL', decimals: 8 },
  };

  for (const f of TWT_FILES) {
    it(`${f} should have correct type and decimals`, () => {
      const info = loadInfoJSON(f);
      const expected = expectedDecimals[f];
      assert.strictEqual(info.type, expected.type, `type mismatch`);
      assert.strictEqual(info.decimals, expected.decimals, `decimals mismatch`);
      assert.ok(validateDecimals(info.decimals), `decimals out of range`);
    });
  }
});

describe('TWT info.json - Asset ID validation', () => {
  const expectedIDs = {
    'blockchains/binance/assets/TWT-8C2/info.json': 'TWT-8C2',
    'blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/info.json': '0x4B0F1812e5Df2A09796481Ff14017e6005508003',
    'blockchains/solana/assets/HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD/info.json': 'HZNpqL7RT9gxf9eWoWsWzC5DfjzQ41XTQgEA7p3VzaaD',
  };

  for (const f of TWT_FILES) {
    it(`${f} should have correct id matching address`, () => {
      const info = loadInfoJSON(f);
      assert.strictEqual(info.id, expectedIDs[f], `id mismatch`);
    });
  }
});

describe('TWT info.json - Consistent data across chains', () => {
  it('all TWT tokens should have same name, symbol, and description', () => {
    const models = TWT_FILES.map((f) => loadInfoJSON(f));

    for (const model of models) {
      assert.strictEqual(model.name, 'Trust Wallet');
      assert.strictEqual(model.symbol, 'TWT');
      assert.strictEqual(model.description, 'Utility token to increase adoption of cryptocurrency.');
    }
  });
});

describe('TWT info.json - All links use HTTPS', () => {
  for (const f of TWT_FILES) {
    it(`${f} all links should use HTTPS`, () => {
      const info = loadInfoJSON(f);
      for (const link of info.links) {
        assert.ok(link.url.startsWith('https://'),
          `Link "${link.name}" URL "${link.url}" does not use HTTPS`);
      }
    });
  }
});

describe('TWT info.json - No duplicate links', () => {
  for (const f of TWT_FILES) {
    it(`${f} should have no duplicate link names`, () => {
      const info = loadInfoJSON(f);
      const names = info.links.map((l) => l.name);
      const unique = new Set(names);
      assert.strictEqual(names.length, unique.size,
        `Duplicate link names found: ${names.filter((n, i) => names.indexOf(n) !== i).join(', ')}`);
    });
  }
});

// --- Spam token tests ---

describe('Spam token info.json', () => {
  const SPAM_FILE = 'blockchains/smartchain/assets/0xF11215614946E7990842b96F998B4797187D8888/info.json';

  it('should be valid JSON', () => {
    const fullPath = resolve(REPO_ROOT, SPAM_FILE);
    const raw = readFileSync(fullPath, 'utf-8');
    assert.doesNotThrow(() => JSON.parse(raw));
  });

  it('should have all required fields', () => {
    const info = loadInfoJSON(SPAM_FILE);
    const missing = validateRequiredAssetFields(info);
    assert.deepStrictEqual(missing, [], `Missing: ${missing.join(', ')}`);
  });

  it('should have status "spam"', () => {
    const info = loadInfoJSON(SPAM_FILE);
    assert.strictEqual(info.status, 'spam');
    assert.ok(validateStatus(info.status));
  });

  it('should have correct id matching address', () => {
    const info = loadInfoJSON(SPAM_FILE);
    assert.strictEqual(info.id, '0xF11215614946E7990842b96F998B4797187D8888');
  });

  it('should have type BEP20', () => {
    const info = loadInfoJSON(SPAM_FILE);
    assert.strictEqual(info.type, 'BEP20');
  });

  it('should have valid decimals', () => {
    const info = loadInfoJSON(SPAM_FILE);
    assert.ok(validateDecimals(info.decimals));
    assert.strictEqual(info.decimals, 18);
  });

  it('should have valid description', () => {
    const info = loadInfoJSON(SPAM_FILE);
    assert.strictEqual(validateDescription(info.description), null);
  });
});

// --- Deleted asset tests ---

describe('Deleted asset logos', () => {
  const DELETED_FILES = [
    'blockchains/ethereum/assets/0x57e299eE8F1C5A92A9Ed54F934ACC7FF5F159699/logo.png',
    'blockchains/tron/assets/1001411/logo.png',
  ];

  for (const f of DELETED_FILES) {
    it(`${f} should no longer exist`, () => {
      const fullPath = resolve(REPO_ROOT, f);
      assert.ok(!existsSync(fullPath), `Expected file to be deleted: ${f}`);
    });
  }
});

// --- Unit tests for link validation logic ---

describe('validateLinks - CoinMarketCap prefix', () => {
  it('should accept valid coinmarketcap link', () => {
    const links = [
      { name: 'github', url: 'https://github.com/trustwallet' },
      { name: 'coinmarketcap', url: 'https://coinmarketcap.com/currencies/trust-wallet-token/' },
    ];
    assert.deepStrictEqual(validateLinks(links), []);
  });

  it('should reject coinmarketcap link with wrong prefix', () => {
    const links = [
      { name: 'github', url: 'https://github.com/trustwallet' },
      { name: 'coinmarketcap', url: 'https://example.com/currencies/trust-wallet-token/' },
    ];
    const errors = validateLinks(links);
    assert.ok(errors.length > 0, 'Expected validation errors');
    assert.ok(errors.some((e) => e.includes('invalid prefix')));
  });

  it('should reject coinmarketcap link without HTTPS', () => {
    const links = [
      { name: 'github', url: 'https://github.com/trustwallet' },
      { name: 'coinmarketcap', url: 'http://coinmarketcap.com/currencies/trust-wallet-token/' },
    ];
    const errors = validateLinks(links);
    assert.ok(errors.length > 0, 'Expected validation errors');
  });
});

describe('validateLinks - general rules', () => {
  it('should skip validation for fewer than 2 links', () => {
    const links = [{ name: 'github', url: 'https://github.com/trustwallet' }];
    assert.deepStrictEqual(validateLinks(links), []);
  });

  it('should skip validation for empty links', () => {
    assert.deepStrictEqual(validateLinks([]), []);
  });

  it('should reject invalid link name', () => {
    const links = [
      { name: 'github', url: 'https://github.com/trustwallet' },
      { name: 'twitter', url: 'https://twitter.com/trustwallet' },
    ];
    const errors = validateLinks(links);
    assert.ok(errors.some((e) => e.includes('invalid link name')));
  });

  it('should reject missing link name', () => {
    const links = [
      { name: 'github', url: 'https://github.com/trustwallet' },
      { name: null, url: 'https://example.com' },
    ];
    const errors = validateLinks(links);
    assert.ok(errors.length > 0);
  });

  it('should reject missing link URL', () => {
    const links = [
      { name: 'github', url: 'https://github.com/trustwallet' },
      { name: 'x', url: null },
    ];
    const errors = validateLinks(links);
    assert.ok(errors.length > 0);
  });

  it('should reject github link with wrong prefix', () => {
    const links = [
      { name: 'github', url: 'https://gitlab.com/trustwallet' },
      { name: 'x', url: 'https://x.com/trustwallet' },
    ];
    const errors = validateLinks(links);
    assert.ok(errors.some((e) => e.includes('invalid prefix')));
  });

  it('should accept valid multi-link set', () => {
    const links = [
      { name: 'github', url: 'https://github.com/trustwallet' },
      { name: 'x', url: 'https://x.com/trustwallet' },
      { name: 'reddit', url: 'https://reddit.com/r/trustapp' },
      { name: 'coinmarketcap', url: 'https://coinmarketcap.com/currencies/trust-wallet-token/' },
    ];
    assert.deepStrictEqual(validateLinks(links), []);
  });
});
