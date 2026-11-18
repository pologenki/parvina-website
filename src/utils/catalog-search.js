const fields = (item, key) => [item[key], item[`${key}_ru`], item[`${key}_cn`]].filter(Boolean);

export function normalizeCatalogQuery(value = '') {
  return String(value).normalize('NFKD').replace(/и\u0306/g, 'й').replace(/И\u0306/g, 'Й').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/(^|[^\p{L}\p{N}])(?:вв|цц)[\s-]*(?=\d)/gu, '$1ww')
    .replace(/(\d)(kg|gr|g|mm|кг|гр|г|公斤|克)(?=$|[^\p{L}])/gu, '$1 $2')
    .replace(/([\p{Script=Han}])([a-z0-9])/gu, '$1 $2')
    .replace(/([a-z0-9])([\p{Script=Han}])/gu, '$1 $2')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function stem(word) {
  if (!/^[а-я]{4,}$/.test(word)) return word;
  const root = word.replace(/(?:иями|ями|ами|ого|ему|ому|ыми|ими|иях|ий|ый|ой|ая|яя|ое|ее|ые|ие|ия|ов|ев|ам|ям|ах|ях|ом|ем|а|я|ы|и|у|ю|е|о)$/u, '');
  return root.length >= 3 ? root : word;
}

const tokenize = values => [...new Set(values.filter(Boolean).flatMap(value =>
  normalizeCatalogQuery(value).split(' ').flatMap(word => {
    const code = word.match(/^([a-z]+)(\d+)$/);
    return code ? [word, code[1], code[2]] : [word];
  })).filter(Boolean))];
const tokenMatches = (term, word) => term.startsWith(word) || stem(term).startsWith(stem(word)) || /\p{Script=Han}/u.test(word) && term.includes(word);
const isCode = word => /^(?:[a-z]{1,8}\d{1,5}|\d{2,5}|[a-z]{1,4})$/.test(word);

export function buildCatalogSearchIndex(products, productLabels = product => ({
  names: fields(product, 'name'),
  terms: [product.id, ...fields(product, 'origin')],
  description: fields(product, 'desc'),
})) {
  return products.filter(product => product.published !== false).flatMap((product, productIndex) => {
    const labels = productLabels(product);
    const names = labels.names || [];
    const baseTerms = tokenize([product.id, ...names, ...(labels.terms || [])]);
    const entry = (variant, variantIndex, ownNames, terms) => {
      const gradeNames = ownNames.map(name => String(name).replace(/\d+(?:[.,]\d+)?(?:\s*\/\s*\d+(?:[.,]\d+)?)?\s*(?:kg|gr|g|mm|кг|гр|г|公斤|克)(?=$|[^\p{L}])/giu, ' '));
      const joinedGradeNames = gradeNames.map(name => name.replace(/\b([a-z]{1,8})[\s-]+(?=\d)/gi, '$1'));
      const shortCodes = gradeNames.flatMap(name => name.match(/\b[A-Z]{2,4}\b/g) || [])
        .filter(word => !['FREE', 'KG', 'GR', 'MM'].includes(word)).map(word => word.toLowerCase());
      const specificTerms = tokenize([...terms, ...joinedGradeNames]);
      return {
        product, productIndex, variant, variantIndex, baseTerms, specificTerms, shortCodes,
        names: ownNames.map(normalizeCatalogQuery),
        nameTokens: tokenize([...ownNames, ...joinedGradeNames]),
        codes: [...new Set([
          ...tokenize([...gradeNames, ...joinedGradeNames]).filter(word => /^(?:[a-z]{1,8}\d{1,5}|\d{2,5})$/.test(word)),
          ...shortCodes,
        ])],
        terms: [...new Set([...baseTerms, ...specificTerms])],
      };
    };
    return [entry(null, null, names, labels.description || []), ...(product.variants || []).map((variant, index) =>
      entry(variant, index, fields(variant, 'name'), [...fields(variant, 'name'), ...fields(variant, 'desc')]))];
  });
}

export function searchCatalog(index, value) {
  const query = normalizeCatalogQuery(value);
  if (!query) return [];
  const words = [...new Set(query.split(' '))];
  // A known grade code must match the grade's own name, never another grade's description.
  const namedCodes = [...new Set(index.filter(entry => entry.variant).flatMap(entry => entry.codes))];
  const shortCodes = new Set(index.filter(entry => entry.variant).flatMap(entry => entry.shortCodes));
  const queryWords = query.split(' ');
  const quantities = new Set(queryWords.filter((word, i) => /^\d+$/.test(word) && /^(?:kg|gr|g|mm|кг|гр|г|公斤|克)$/.test(queryWords[i + 1] || '')));
  const matchesCode = (code, word) => /^\d+$/.test(word) ? code === word : code.startsWith(word);
  const codes = words.filter(word => isCode(word) && (/\d/.test(word) || shortCodes.has(word)) && !quantities.has(word) && namedCodes.some(code => matchesCode(code, word)));
  const matching = index.filter(entry =>
    (!codes.length || entry.variant && codes.every(code => entry.codes.some(term => matchesCode(term, code)))) &&
    words.every(word => entry.terms.some(term => tokenMatches(term, word))));
  const qualifiedProducts = new Set(matching.filter(entry => entry.variant && words.some(word =>
    !entry.baseTerms.some(term => tokenMatches(term, word)) && entry.specificTerms.some(term => tokenMatches(term, word)))).map(entry => entry.product.id));
  return matching.filter(entry => entry.variant || !qualifiedProducts.has(entry.product.id))
    .map(entry => ({
      ...entry,
      score: (entry.variant ? 200 : 100) - (entry.names.includes(query) ? 200 : 0) -
        words.reduce((score, word) => score + (entry.nameTokens.includes(word) ? 40 : entry.nameTokens.some(term => tokenMatches(term, word)) ? 25 : 0), 0),
    }))
    .sort((a, b) => a.score - b.score || a.productIndex - b.productIndex || (a.variantIndex ?? -1) - (b.variantIndex ?? -1));
}
