import { useEffect } from "react"

declare global {
	interface Window {
		dataLayer?: unknown[]
		gtag?(...args: unknown[]): void
	}
}

export const GoogleAnalytics = ({ trackingId }: { trackingId: string }) => {
	useEffect(() => {
		if (trackingId) {
			if ((window.dataLayer || []).length > 0) return

			const script = document.createElement("script")
			script.async = true
			script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
			document.head.appendChild(script)

			const gtagInitScript = document.createElement("script")
			gtagInitScript.id = "gtag-init"
			gtagInitScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
      `
			document.head.appendChild(gtagInitScript)
		}

		return () => {
			const gtagInitScript = document.getElementById("gtag-init")
			if (gtagInitScript) document.head.removeChild(gtagInitScript)
		}
	}, [trackingId])

	return null
}

