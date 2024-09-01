import { describe, it, expect } from 'vitest';
import { objectToFormData } from '$lib/utils/form';

describe('objectToFormData()', () => {
	it('objectToFormData() should properly add arrays, ex. ingredients[]', () => {
		const result = objectToFormData({
			flags: ['flag1', 'flag2'],
			ingredients: ['ingredient1', 'ingredient2']
		});

		expect(result.getAll('flags[]')).toEqual(['flag1', 'flag2']);
		expect(result.getAll('ingredients[]')).toEqual(['ingredient1', 'ingredient2']);
	});
});
