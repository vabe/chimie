import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import {
	representationTypes,
	type RepresentationType,
	representationMapper,
	basePath,
	moleculeToSVGOptions
} from './constants';
import { Molecule as MoleculeService, type IMoleculeToSVGOptions } from 'openchemlib/minimal';

export type Molecule = Record<RepresentationType, string>;
export type MoleculeStorage = Molecule[];

export type PubChemCompound = {
	MolecularFormula: string;
	CanonicalSMILES: string;
	IsomericSMILES: string;
	InChI: string;
	InChIKey: string;
	Complexity: number;
};

export type PubChemResponse = {
	PropertyTable: {
		Properties: PubChemCompound[];
	};
};

export async function getRandomMoleculeFromApi() {
	const randomId = getRandomInt(1, 2_000_000);
	const moleculeResponse = await fetch(getUrlFromId(randomId));
	return (await moleculeResponse.json()) as PubChemResponse;
}

export function getAllSupportedRepresentations() {
	return representationTypes
		.map((representation) => representationMapper[representation])
		.join(',');
}

export function getRepresentation(response: PubChemResponse, representation: RepresentationType) {
	return response.PropertyTable.Properties[0][
		representationMapper[representation] as keyof PubChemCompound
	].toString();
}

export function parseResponseToMolecule(response: PubChemResponse) {
	return representationTypes.reduce(
		(acc, representation) => ({
			...acc,
			[representation]: getRepresentation(response, representation)
		}),
		{} as Molecule
	);
}

export function getUrlFromId(id: number) {
	const representations = getAllSupportedRepresentations();
	return `${basePath}/cid/${id}/property/${representations},Complexity/JSON`;
}

export function getSVGFromSmiles(
	smiles: string,
	width = 250,
	height = 128,
	options: IMoleculeToSVGOptions = moleculeToSVGOptions
) {
	return MoleculeService.fromSmiles(smiles).toSVG(width, height, undefined, options);
}

export async function copyToClipboard(molecule: Molecule, representation: RepresentationType) {
	await navigator.clipboard.writeText(molecule[representation]);
}

export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};
