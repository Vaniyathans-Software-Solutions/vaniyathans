const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise navigation callbacks with a browser stub, without starting a server.
function setup(hash = '', pathname = '/') {
  const states = [], refs = [], effects = [], frames = new Map(), listeners = new Map(), writes = [], scrolls = [];
  let stateIndex = 0, refIndex = 0, frameId = 0, mounting = true, scrollTop = 0;
  const react = {
    useState(initial) { const i = stateIndex++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; },
    useRef(initial) { const i = refIndex++; return refs[i] ||= { current: initial }; },
    useCallback(callback) { return callback; },
    useEffect(effect) { if (mounting) effects.push(effect); },
  };
  const location = { hash, pathname, search: '?campaign=demo' };
  const historyState = { retained: true };
  const window = {
    location, innerHeight: 800, matchMedia: () => ({ matches: false }),
    history: { state: historyState },
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: name => listeners.delete(name),
  };
  for (const method of ['pushState', 'replaceState']) window.history[method] = (state, _, hash) => {
    writes.push({ method, state, hash }); location.hash = hash;
  };
  const sections = ['expertise', 'method', 'journey', 'contact'].map((id, index) => ({
    id, getBoundingClientRect: () => ({ top: index * 800 - scrollTop }),
    scrollIntoView: options => scrolls.push({ id, ...options }),
  }));
  const document = { querySelectorAll: () => sections, querySelector: () => null };
  const modules = new Map();
  const jsx = (type, props) => ({ type, props });
  function load(name) {
    if (modules.has(name)) return modules.get(name);
    const exports = {};
    const source = fs.readFileSync(path.join(__dirname, '../app', `${name}.tsx`), 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, {
      exports, window, document, setTimeout: () => 1, clearTimeout: () => {},
      requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame: id => frames.delete(id),
      require(id) {
        if (id === 'react') return react;
        if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'fragment' };
        if (id.endsWith('LocaleProvider')) return { useLocale: () => ({ t: value => value, locale: 'en' }) };
        if (id === './HeroCarousel') return load('HeroCarousel');
        if (id === './SiteHeader') return load('SiteHeader');
        return { default: () => null };
      },
    });
    modules.set(name, exports);
    return exports;
  }
  const Pitch = load('PitchNavigation').default;
  const renderComponent = name => {
    stateIndex = 0; refIndex = 0;
    return Pitch({ children: null }).props.children.find(child => child?.type === load(name).default).props;
  };
  const render = () => renderComponent('HeroCarousel');
  const flush = () => { while (frames.size) { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); } };
  render(); effects.forEach(effect => effect()); mounting = false; flush();
  return { render, location, writes, scrolls, historyState, slides: load('HeroCarousel').heroSlides,
    header: () => renderComponent('SiteHeader'),
    headerTree: () => load('SiteHeader').default(renderComponent('SiteHeader')),
    scrollTo(top) { scrollTop = top; listeners.get('wheel')(); listeners.get('scroll')(); flush(); },
    navigate(hash, event = 'hashchange') { location.hash = hash; listeners.get(event)(); flush(); },
  };
}

test('each hero anchor opens its matching slide on initial landing, including localized URLs', () => {
  const anchors = ['vision', 'personal-brand', 'webshops', 'software', 'ai-agents'];
  for (const pathname of ['/', '/ml', '/ta', '/hi']) {
    anchors.forEach((anchor, index) => {
      const app = setup(`#${anchor}`, pathname);
      assert.equal(app.slides[index].anchor, anchor);
      assert.equal(app.render().activeIndex, index);
      assert.equal(app.scrolls.at(-1).id, 'expertise');
      assert.equal(app.scrolls.at(-1).behavior, 'instant');
      assert.equal(app.writes.length, 0);
    });
  }
});

test('selection creates a shareable link and history navigation restores the requested hero', () => {
  const app = setup('', '/ml');
  app.render().onSelect(3);
  assert.equal(app.location.hash, '#software');
  assert.equal(app.writes.at(-1).method, 'pushState');
  assert.equal(app.writes.at(-1).state, app.historyState);
  assert.equal(app.location.pathname, '/ml');
  assert.equal(app.location.search, '?campaign=demo');
  app.navigate('#personal-brand', 'popstate');
  assert.equal(app.render().activeIndex, 1);
  app.navigate('#ai-agents');
  assert.equal(app.render().activeIndex, 4);
  app.navigate('');
  assert.equal(app.render().activeIndex, 0);
  assert.equal(app.writes.length, 1);
});

test('autoplay replaces hero history and the last hero still advances to the process', () => {
  const app = setup('#software');
  app.render().onAutoAdvance();
  assert.equal(app.render().activeIndex, 4);
  assert.equal(app.location.hash, '#ai-agents');
  assert.equal(app.writes.at(-1).method, 'replaceState');
  app.render().onNext();
  assert.equal(app.location.hash, '#method');
  assert.equal(app.scrolls.at(-1).id, 'method');
});

test('existing section links and unknown hashes are preserved', () => {
  for (const hash of ['#method', '#journey', '#contact', '#unknown']) {
    const app = setup(hash);
    assert.equal(app.location.hash, hash);
    assert.equal(app.scrolls.length, 0);
    assert.equal(app.writes.length, 0);
  }
});

test('main navigation follows clicks, hero deep links, and scrolling through sections', () => {
  const app = setup('#ai-agents');
  assert.equal(app.header().activeSection, 'expertise');
  app.header().onSelectSection('journey');
  assert.equal(app.header().activeSection, 'journey');
  assert.equal(app.location.hash, '#journey');
  for (const [top, expected] of [[800, 'method'], [1600, 'journey'], [2400, null], [0, 'expertise']]) {
    app.scrollTo(top);
    assert.equal(app.header().activeSection, expected);
  }
});

test('desktop and mobile navigation mark only the current section', () => {
  const app = setup();
  app.header().onSelectSection('method');
  const links = [];
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'a' && node.props.className === 'mainNavSection') links.push(node.props);
    const children = node.props?.children;
    (Array.isArray(children) ? children : [children]).forEach(visit);
  };
  visit(app.headerTree());
  assert.equal(links.length, 6);
  assert.deepEqual(links.filter(link => link['aria-current'] === 'location').map(link => link.href), ['#method', '#method']);
});
