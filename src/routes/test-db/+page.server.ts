import { eq } from 'drizzle-orm';
import { db, placeReviews, places, profiles } from '$lib/db';

export const load = async () => {
	const result = await db
		.select({
			id: places.id,
			name: places.name,
			reviews: {
				content: placeReviews.content,
				rating: placeReviews.rating,
				authorUsername: profiles.username
			}
		})
		.from(places)
		.leftJoin(placeReviews, eq(places.id, placeReviews.placeID))
		.leftJoin(profiles, eq(placeReviews.authorID, profiles.id))
		.execute();

	console.log('result: ', result);

	return {
		success: true,
		status: 200,
		places: result
	};
};
