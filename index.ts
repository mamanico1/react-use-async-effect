import { useEffect } from 'react';

export default function useAsyncEffect(
	mountCallback: any,
	unmountCallback?: any,
	deps?: any,
): void {
	let mounted = false
	const hasUnmountCb = typeof unmountCallback === 'function';
	const dependencies = hasUnmountCb ? deps : unmountCallback
	useEffect(() => {
		mounted = true;
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let ignore = false;
		let mountSucceeded = false;

		(async () => {
			await Promise.resolve();
			if (!mounted || ignore) {
				return;
			}
			await mountCallback();
			mountSucceeded = true;
			if (mounted && !ignore) { // not reach unmount
				return
			} else {
				// unmounted before the mount callback returned
				hasUnmountCb && unmountCallback();
			}

		})();

		return () => {
			ignore = true;
			if (mountSucceeded && hasUnmountCb) {
				unmountCallback()
			}
		};
	}, dependencies);
};
