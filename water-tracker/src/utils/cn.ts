import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

type ClassInput = string | number | null | undefined | Record<string, boolean> | ClassInput[]

export function cn(...inputs: ClassInput[]) {
	return twMerge(classNames(inputs))
}