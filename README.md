# LensLoom

LensLoom is an image-search app: type a topic, and it weaves together a responsive wall of matching images pulled from the Wikimedia Commons API (free, no key required). It handles loading, empty, and error states, and is deployed live.

🔗 Live app: https://chezhil.github.io/lensloom/
💻 Source: https://github.com/chezhil/lensloom

Two design decisions:

- **Sidebar layout instead of a top header.** I put the branding, search form, and category chips in a fixed left sidebar so the results grid gets the full remaining width and reads like a dashboard rather than a single-column page.
- **Dark theme with amber + teal accents.** I picked a dark panel background with a warm amber call-to-action and a cool teal for status text, to give the app its own identity and keep good contrast, distinct from a light/purple reference palette.
