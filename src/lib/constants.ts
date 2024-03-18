export const basePath = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound';

export const representationTypes = ['smiles', 'inchi', 'inchiKey', 'molecularFormula'] as const;
export type RepresentationType = (typeof representationTypes)[number];

export const representationMapper = {
	smiles: 'CanonicalSMILES',
	inchi: 'InChI',
	inchiKey: 'InChIKey',
	molecularFormula: 'MolecularFormula'
} as const;
