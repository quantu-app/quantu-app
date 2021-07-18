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
		const location = await getGeolocation(position);
		return (
			[location.town || location.neighbourhood, location.state, location.country]
				.filter((value) => !!value)
				.join(', ') || 'Unknown'
		);
	} else {
		return 'Unknown';
	}
}

function checkPrototypeProperty(obj: Record<string, unknown>) {
	for (const key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) {
			return false;
		}
	}
	return true;
}

export function isEmptyObject(value: unknown, checkOwnProperty = false) {
	const result =
		value !== null &&
		typeof value === 'object' &&
		value.constructor === Object &&
		Object.keys(value).length === 0;
	if (!result || !checkOwnProperty) {
		return result;
	}
	return checkPrototypeProperty(value as Record<string, unknown>);
}

export function getWordCount(text: string): number {
	return text
		.replace(/[^\w]+/gi, ' ')
		.trim()
		.split(' ').length;
}
