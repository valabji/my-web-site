export function buildAlternateNames(identity) {
  return [identity.givenName, ...identity.alternateGivenNames]
    .flatMap((givenName) =>
      [identity.familyName, ...identity.alternateFamilyNames].map(
        (familyName) => `${givenName} ${familyName}`,
      ),
    )
    .filter((name) => name !== identity.name);
}

export function addPersonAliases(value, identity) {
  const alternateNames = buildAlternateNames(identity);

  function enrich(child) {
    if (Array.isArray(child)) return child.map(enrich);
    if (!child || typeof child !== 'object') return child;

    const enriched = Object.fromEntries(
      Object.entries(child).map(([key, nested]) => [key, enrich(nested)]),
    );

    if (enriched['@type'] === 'Person' && enriched.name === identity.name) {
      return {
        ...enriched,
        givenName: identity.givenName,
        familyName: identity.familyName,
        alternateName: enriched.alternateName || alternateNames,
      };
    }

    return enriched;
  }

  return enrich(value);
}
