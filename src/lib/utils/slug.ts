export function convertTitleToSlug(title: string): string {
	// Step 1: Convert to lowercase
	let slug = title.toLowerCase();

	// Step 2: Remove special characters using a regex (except hyphens and spaces)
	slug = slug.replace(/[^a-z0-9\s-]/g, '');

	// Step 3: Replace spaces with hyphens
	slug = slug.replace(/\s+/g, '-');

	// Step 4: Remove any multiple consecutive hyphens (if any)
	slug = slug.replace(/-+/g, '-');

	// Step 5: Trim hyphens from the start and end of the slug
	slug = slug.replace(/^-+|-+$/g, '');

	// Step 6: Optionally, truncate the slug to a certain length (e.g., 50 characters)
	if (slug.length > 50) {
		slug = slug.substring(0, 50).replace(/-+$/g, ''); // Ensure no trailing hyphen
	}

	return slug;
}
