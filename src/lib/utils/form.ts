// eslint-disable-next-line
export function formDataToObject(formData: FormData): Record<string, any> {
	return Object.fromEntries(formData);
}

// eslint-disable-next-line
export function objectToFormData(obj: Record<string, any>, formData?: FormData): FormData {
	formData = formData || new FormData();

	Object.keys(obj).forEach((key) => {
		if (obj[key] && Array.isArray(obj[key])) {
			// eslint-disable-next-line
			obj[key].forEach((item: any, idx: number) => {
				formData.append(key + '[]', item);
			});
		} else {
			formData.append(key, obj[key]);
		}
	});

	return formData;
}
