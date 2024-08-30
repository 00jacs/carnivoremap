import Root from './input.svelte';

export type FormInputEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLInputElement;
};
export type InputEvents = {
	blur: FormInputEvent;
	change: FormInputEvent;
	click: FormInputEvent;
	focus: FormInputEvent;
	focusin: FormInputEvent;
	focusout: FormInputEvent;
	keydown: FormInputEvent;
	keypress: FormInputEvent;
	keyup: FormInputEvent;
	mouseover: FormInputEvent;
	mouseenter: FormInputEvent;
	mouseleave: FormInputEvent;
	mousemove: FormInputEvent;
	paste: FormInputEvent;
	input: FormInputEvent;
	wheel: FormInputEvent;
};

export {
	Root,
	//
	Root as Input
};
