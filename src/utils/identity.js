export function buildAlternateNames(identity) {
  const latinNames = [identity.givenName, ...identity.alternateGivenNames]
    .flatMap((givenName) =>
      [identity.familyName, ...identity.alternateFamilyNames].map(
        (familyName) => `${givenName} ${familyName}`,
      ),
    )
  return [...latinNames, identity.nameArabic, ...(identity.alternateArabicNames || [])]
    .filter(Boolean)
    .filter((name, index, names) => name !== identity.name && names.indexOf(name) === index);
}

export function addPersonAliases(value, identity) {
  const alternateNames = buildAlternateNames(identity);

  function enrich(child) {
    if (Array.isArray(child)) return child.map(enrich);
    if (!child || typeof child !== 'object') return child;

    const enriched = Object.fromEntries(
      Object.entries(child).map(([key, nested]) => [key, enrich(nested)]),
    );

    if (
      enriched['@type'] === 'Person'
      && [identity.name, identity.nameArabic].includes(enriched.name)
    ) {
      const isArabic = enriched.name === identity.nameArabic;
      const aliases = alternateNames.filter((name) => name !== enriched.name);
      return {
        ...enriched,
        givenName: isArabic ? identity.givenNameArabic : identity.givenName,
        familyName: isArabic ? identity.familyNameArabic : identity.familyName,
        alternateName: enriched.alternateName || aliases,
      };
    }

    return enriched;
  }

  return enrich(value);
}
