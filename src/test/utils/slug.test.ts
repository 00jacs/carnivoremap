import { describe, it, expect } from 'vitest';
import { convertTitleToSlug } from '$lib/utils/slug';

describe('convertTitleToSlug', () => {
	it('converts title to lowercase', () => {
		expect(convertTitleToSlug('HELLO WORLD')).toBe('hello-world');
	});

	it("removes ',' and other special characters", () => {
		expect(convertTitleToSlug('Hello, World!')).toBe('hello-world');
	});

	it('properly handles string with -', () => {
		expect(convertTitleToSlug('Dairy-free')).toBe('dairy-free');
	});
});
