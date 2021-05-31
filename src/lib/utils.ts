import type { Text } from 'automerge';
import type Op from 'quill-delta/dist/Op';

export const addEventListener: typeof window.addEventListener = (type, listener, options) => {
	if (typeof window !== 'undefined') {
		window.addEventListener(type, listener, options);
	}
};

export const removeEventListener: typeof window.removeEventListener = (type, listener, options) => {
	if (typeof window !== 'undefined') {
		window.removeEventListener(type, listener, options);
	}
};

export function applyOpsToText(text: Text, ops: Op[]): void {
	let i = 0;
	for (const op of ops) {
		if (op.retain) {
			i += op.retain;
		}
		if (typeof op.insert === 'string') {
			const chars = op.insert.split('');
			text.insertAt!(i, ...chars);
			i += chars.length;
		} else if (op.delete) {
			text.deleteAt!(i, op.delete);
		}
	}
}

export async function getGeolocation(position: GeolocationPosition) {
	const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=xml&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
		),
		xml = new DOMParser().parseFromString(await response.text(), 'application/xml'),
		addressparts = xml.getElementsByTagName('addressparts')[0],
		country = addressparts?.getElementsByTagName('country')[0]?.textContent || '',
		state = addressparts?.getElementsByTagName('state')[0]?.textContent || '',
		town = addressparts?.getElementsByTagName('town')[0]?.textContent || '',
		neighbourhood = addressparts?.getElementsByTagName('neighbourhood')[0]?.textContent || '';
	return { country, state, town, neighbourhood };
}

export function getGeolocationPosition() {
	return new Promise<GeolocationPosition | null>((resolve) =>
		navigator.geolocation.getCurrentPosition(resolve, (error) => {
			console.error(error);
			resolve(null);
		})
	);
}

export async function getLocationName() {
	const position = await getGeolocationPosition();

	if (position) {
		const location = await getGeolocation(position),
			city =
				location.town || location.neighbourhood
					? (location.town || location.neighbourhood) + ' '
					: '',
			state = location.state ? location.state + ' ' : '',
			country = location.country ? location.country : '';

		return city + state + country;
	} else {
		return 'Unknown';
	}
}
