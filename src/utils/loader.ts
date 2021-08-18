export function removeLoader(idName: string = 'loader') {
	document.getElementById(idName).remove();
}

export function removeExtension(path:string): string {
	return path.split('.').slice(0, -1).join('.')
}