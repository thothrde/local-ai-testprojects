# Privacy

Finance2Agent Game Europe G0A is a static browser game.

- No account is required by the game.
- No cloud LLM or external inference service is used.
- No analytics backend is included.
- No playtest telemetry is transmitted to the developer by the game.
- The Godot runtime stores preferences and playtest telemetry only in the browser-local `user://` storage (implemented by the browser through local persistent storage such as IndexedDB).

Deleting the site's local browser storage removes these locally stored game records.
