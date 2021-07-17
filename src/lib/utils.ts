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
