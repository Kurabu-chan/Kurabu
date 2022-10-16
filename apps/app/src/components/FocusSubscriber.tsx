import { useFocusEffect } from "@react-navigation/native"
import React from "react"

type Props = { onFocus: () => void }
export function FocusSubscriber({ onFocus }: Props) {
	useFocusEffect(
		React.useCallback(() => {
			onFocus();
		}, [onFocus])
	)

	return null
}
