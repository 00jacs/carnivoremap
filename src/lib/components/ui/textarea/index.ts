import Root from './textarea.svelte';

type FormTextareaEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLTextAreaElement;
};

type TextareaEvents = {
	blur: FormTextareaEvent;
	change: FormTextareaEvent;
	click: FormTextareaEvent;
	focus: FormTextareaEvent;
	keydown: FormTextareaEvent;
	keypress: FormTextareaEvent;
	keyup: FormTextareaEvent;
	mouseover: FormTextareaEvent;
	mouseenter: FormTextareaEvent;
	mouseleave: FormTextareaEvent;
	paste: FormTextareaEvent;
	input: FormTextareaEvent;
};

export {
	Root,
	//
	Root as Textarea,
	type TextareaEvents,
	type FormTextareaEvent
};
