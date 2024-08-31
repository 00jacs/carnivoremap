<script lang="ts">
	import { user } from '$lib/auth';

	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';

	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { type Selected } from 'bits-ui';
	import * as Select from '$lib/components/ui/select';

	import { ZodError } from 'zod';
	import _flags from '$lib/constants/food-flags';
	import { CreateRecipeFormSchema } from './_validate';
	import { form } from './_cache';

	let price_range: Selected<unknown> | undefined = {
		value: $form.price_range,
		label: $form.price_range.charAt(0).toUpperCase() + $form.price_range.slice(1),
		disabled: false
	} as Selected<unknown>;

	let formErrors = {
		title: '',
		description: '',
		flags: '',
		prep_time: '',
		cook_time: '',
		price_range: '',
		video_link: '',
		ingredients: '',
		content: ''
	};

	const flags = _flags.map((ingredient) => ({
		id: ingredient,
		text: ingredient,
		checked: $form?.flags?.includes(ingredient) || false
	}));

	interface RecipeIngredient {
		text: string;
		quantity: string;
		currentlyEdited?: boolean;
	}

	let necessaryIngredients: RecipeIngredient[] = $form.ingredients.map((ingr) => {
		const [text, quantity] = ingr.split('###');
		return {
			text,
			quantity,
			currentlyEdited: false
		};
	});

	let showNewIngredientPopup: boolean = false;
	let newIngredient: RecipeIngredient = {
		text: '',
		quantity: ''
	};

	let editedIngredient: RecipeIngredient & { idx: number } = {
		idx: -1,
		text: '',
		quantity: ''
	};

	function onFlagToggle() {
		$form.flags = flags.filter((flag) => flag.checked).map((flag) => flag.id);
	}

	function onPriceRangeChange(newValue: unknown) {
		$form.price_range = (newValue as string) || '';
		console.log('new price range', $form.price_range);
	}

	// @todo: implement category chooser
	// function onCategorySelect() {
	// $form.category = chosenCategory;
	// }

	function addNewIngredient() {
		// @todo: add validation
		necessaryIngredients = [
			...necessaryIngredients,
			{
				text: newIngredient.text,
				quantity: newIngredient.quantity,
				currentlyEdited: false
			}
		];

		$form.ingredients = necessaryIngredients.map((ingr) => `${ingr.text}###${ingr.quantity}`);

		newIngredient = {
			text: '',
			quantity: ''
		};

		showNewIngredientPopup = false;
	}

	function editIngredient() {
		if (editedIngredient.idx === -1 || editedIngredient.idx >= necessaryIngredients.length) return;

		// @todo: add validation
		necessaryIngredients[editedIngredient.idx] = {
			text: editedIngredient.text,
			quantity: editedIngredient.quantity
		};

		necessaryIngredients[editedIngredient.idx].currentlyEdited = false;
		necessaryIngredients = necessaryIngredients;

		editedIngredient = {
			idx: -1,
			text: '',
			quantity: ''
		};
	}

	function removeIngredient() {
		if (editedIngredient.idx === -1 || editedIngredient.idx >= necessaryIngredients.length) return;

		necessaryIngredients[editedIngredient.idx].currentlyEdited = false;
		necessaryIngredients = necessaryIngredients.filter((_, idx) => idx !== editedIngredient.idx);

		editedIngredient = {
			idx: -1,
			text: '',
			quantity: ''
		};
	}

	function handleCreateRecipe() {
		try {
			const schema = CreateRecipeFormSchema.parse($form);
			console.log('sending schema to the server: ', schema);
		} catch (error) {
			if (error && error instanceof ZodError) {
				const fieldErrors = error.flatten().fieldErrors;

				for (const key in fieldErrors) {
					if (key in formErrors) {
						// @ts-expect-error - we know that key is a key of formErrors
						formErrors[key] = fieldErrors[key];
					}
				}
			}
		}

		// send a request to the server
	}
</script>

{#if $user}
	<div class="mx-auto mt-16 max-w-4xl px-8 pb-36">
		<h1 class="mb-8 text-xl font-semibold md:text-3xl">Create your recipe</h1>

		<form on:submit|preventDefault={handleCreateRecipe}>
			<div class="grid gap-8">
				<div class="grid w-full items-center gap-1.5">
					<Label for="title">Title</Label>

					{#if formErrors.title}
						<p class="text-sm font-semibold text-primary">{formErrors.title}.</p>
					{/if}

					<Input
						type="text"
						id="title"
						placeholder="Unique title of your recipe"
						class={formErrors.title ? 'border-primary' : ''}
						required
						bind:value={$form.title} />
					<p class="text-sm text-muted-foreground">
						This will be a unique title for your recipe. Should be descriptive, concise, and clear.
					</p>
				</div>

				<Separator class="my-2" />

				<div class="grid w-full items-center gap-1.5">
					<Label for="description" class="ml-1">Description</Label>

					{#if formErrors.description}
						<p class="text-sm font-semibold text-primary">{formErrors.description}.</p>
					{/if}

					<Input
						type="text"
						id="description"
						placeholder="Delicious, dairy-free pancakes with eggs and collagen only..."
						class={formErrors.description ? 'border-primary' : ''}
						required
						bind:value={$form.description} />
					<p class="ml-1.5 text-sm text-muted-foreground">
						Describe your recipe in 1-2 sentences to give a brief overview of what it is. This will
						be displayed in search results.
					</p>
				</div>

				<Separator class="my-2" />

				<div class="grid gap-2">
					<Label for="ingredients">Select ALL appropriate flags</Label>

					{#if formErrors.flags}
						<p class="text-sm font-semibold text-primary">{formErrors.flags}.</p>
					{/if}

					<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
						{#each flags as flag}
							<div
								role="button"
								tabindex="0"
								on:keydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') onFlagToggle();
								}}
								class="flex items-center space-x-2"
								on:click={onFlagToggle}>
								<Checkbox id={flag.id} bind:checked={flag.checked} />

								<Label
									for={flag.id}
									class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									{flag.text}
								</Label>
							</div>
						{/each}
					</div>
				</div>

				<Separator class="my-2" />

				<div class="grid gap-2">
					<Label for="video-link">Link to a video (optional)</Label>

					{#if formErrors.video_link}
						<p class="text-sm font-semibold text-primary">{formErrors.video_link}.</p>
					{/if}

					<Input
						id="video-link"
						name="video-link"
						placeholder="Share a link to a video if you have one"
						class={formErrors.video_link ? 'border-primary' : ''}
						bind:value={$form.video_link} />
				</div>

				<Separator class="my-2" />

				<div class="grid grid-cols-1 gap-3 gap-y-8 md:grid-cols-3">
					<div>
						<Label for="prep-time">Preperation time (minutes)</Label>

						{#if formErrors.prep_time}
							<p class="mb-1 text-sm font-semibold text-primary">{formErrors.prep_time}.</p>
						{/if}

						<Input
							type="number"
							id="prep-time"
							name="prep-time"
							placeholder="Minutes of preperation required"
							required
							class={formErrors.prep_time ? 'border-primary' : ''}
							bind:value={$form.prep_time} />
					</div>

					<div>
						<Label for="cooking-time">Cooking time (minutes)</Label>

						{#if formErrors.cook_time}
							<p class="mb-1 text-sm font-semibold text-primary">{formErrors.cook_time}.</p>
						{/if}

						<Input
							id="cooking-time"
							name="cooking-time"
							type="number"
							placeholder="Minutes of cooking required"
							required
							class={formErrors.cook_time ? 'border-primary' : ''}
							bind:value={$form.cook_time} />
					</div>

					<div>
						<Label for="price">Price range</Label>

						{#if formErrors.price_range}
							<p class="mb-1 text-sm font-semibold text-primary">{formErrors.price_range}.</p>
						{/if}

						<Select.Root
							required
							bind:selected={price_range}
							onSelectedChange={(newVal) => onPriceRangeChange(newVal?.value || '')}>
							<Select.Trigger class={formErrors.price_range ? 'border-primary' : ''}>
								<Select.Value placeholder="Choose a price range..." />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="cheap">Cheap</Select.Item>
								<Select.Item value="affordable">Affordable</Select.Item>
								<Select.Item value="medium">Medium</Select.Item>
								<Select.Item value="expensive">Expensive</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<Separator class="my-2" />

				<div class="grid gap-2">
					<Label for="necessary-ingredients">Create a list of necessary ingredients</Label>

					{#if formErrors.ingredients}
						<p class="mb-1 text-sm font-semibold text-primary">{formErrors.ingredients}.</p>
					{/if}

					{#if necessaryIngredients.length == 0}
						<p class="text-sm text-muted-foreground">No ingredients added yet...</p>
					{:else}
						<ul class="grid gap-2">
							{#each necessaryIngredients as ingredient, idx}
								<li
									class="flex items-center justify-between gap-1 rounded-xl border px-4 py-2 text-sm">
									<p class="mr-4">{ingredient.text} | {ingredient.quantity}</p>

									<Popover.Root bind:open={ingredient.currentlyEdited}>
										<Popover.Trigger asChild let:builder>
											<Button
												builders={[builder]}
												variant="outline"
												size="icon"
												on:click={() => {
													editedIngredient = { ...ingredient, idx };
												}}>
												<EllipsisVertical class="h-4 w-4" />
											</Button>
										</Popover.Trigger>
										<Popover.Content class="w-80">
											<div class="grid gap-4">
												<div class="space-y-2">
													<h4 class="font-medium leading-none">Edit your ingredient</h4>
													<p class="text-sm text-muted-foreground">
														What's the ingredient and how much is needed?
													</p>
												</div>
												<div class="grid gap-2">
													<div class="grid grid-cols-3 items-center gap-4">
														<Label for="new-ingredient-name">Name</Label>
														<Input
															id="new-ingredient-name"
															bind:value={editedIngredient.text}
															placeholder="Eggs, rib-eye, ..."
															class="col-span-2 h-8" />
													</div>
													<div class="grid grid-cols-3 items-center gap-4">
														<Label for="new-ingredient-quality">Quantity</Label>
														<Input
															id="new-ingredient-quality"
															bind:value={editedIngredient.quantity}
															placeholder="350g, 200ml, ..."
															class="col-span-2 h-8" />
													</div>
												</div>
												<div class="grid gap-2">
													<Button type="button" on:click={editIngredient}>Edit ingredient</Button>
													<Button type="button" variant="outline" on:click={removeIngredient}>
														Remove ingredient
													</Button>
												</div>
											</div>
										</Popover.Content>
									</Popover.Root>
								</li>
							{/each}
						</ul>
					{/if}

					<Popover.Root bind:open={showNewIngredientPopup}>
						<Popover.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								{...necessaryIngredients.length !== 0 && formErrors.ingredients
									? { variant: 'outline' }
									: {}}>
								Add ingredient
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-80">
							<div class="grid gap-4">
								<div class="space-y-2">
									<h4 class="font-medium leading-none">Adding ingredient</h4>
									<p class="text-sm text-muted-foreground">
										What's the ingredient and how much is needed?
									</p>
								</div>
								<div class="grid gap-2">
									<div class="grid grid-cols-3 items-center gap-4">
										<Label for="new-ingredient-name">Name</Label>
										<Input
											id="new-ingredient-name"
											bind:value={newIngredient.text}
											placeholder="Eggs, rib-eye, ..."
											class="col-span-2 h-8" />
									</div>
									<div class="grid grid-cols-3 items-center gap-4">
										<Label for="new-ingredient-quality">Quantity</Label>
										<Input
											id="new-ingredient-quality"
											bind:value={newIngredient.quantity}
											placeholder="350g, 200ml, ..."
											class="col-span-2 h-8" />
									</div>
								</div>
								<div class="grid gap-2">
									<Button type="button" on:click={addNewIngredient}>Add ingredient</Button>
								</div>
							</div>
						</Popover.Content>
					</Popover.Root>
				</div>

				<Separator class="my-2" />

				<div class="grid gap-2">
					<Label for="instructions">Instructions</Label>

					{#if formErrors.content}
						<p class="text-sm font-semibold text-primary">{formErrors.content}.</p>
					{/if}

					<Textarea
						id="instructions"
						name="instructions"
						placeholder="Share your instructions - how to prepare your recipe? What are the steps? What ingredients are needed? How long does it take to prepare? Please try to make it clear and detailed."
						class="{formErrors.content ? 'border-primary' : ''} min-h-32"
						required
						bind:value={$form.content} />
					<p class="text-sm text-muted-foreground">
						Please provide detailed instructions on how to prepare your recipe. This will be
						displayed to users when they go to your recipe details.
					</p>
				</div>

				<div>
					<Button type="submit" class="w-full">Create recipe</Button>
					<p class="mt-2 text-center text-xs text-muted-foreground">and earn +10 🥩</p>
				</div>
			</div>
		</form>
	</div>
{:else}
	<div class="mx-auto mt-12 max-w-2xl px-8">
		<h1 class="text-center text-xl font-semibold md:text-2xl">
			You need to be logged in to create a recipe.
		</h1>

		<div class="flex flex-col items-center justify-center gap-4">
			<p class="mt-6 flex flex-col items-center justify-center gap-3 text-center">
				Already have an account?
				<Button href="/auth/login" variant="secondary">Sign in.</Button>
			</p>

			<p class="mt-4 flex flex-col items-center justify-center gap-3 text-center">
				Don't have an account?
				<Button href="/auth/register" variant="outline">Sign up.</Button>
			</p>
		</div>
	</div>
{/if}
