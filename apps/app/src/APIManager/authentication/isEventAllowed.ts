import { EventObject } from "xstate";

export function isEventAllowed<TEvent extends Record<string, EventObject>, TAllowed extends string>(event: EventObject, allowedEvents: readonly TEvent[TAllowed]["type"][]): event is TEvent[TAllowed] {
	const isAllowed = allowedEvents.includes(event.type as TAllowed);

	return isAllowed;
}
