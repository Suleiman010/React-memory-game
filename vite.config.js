import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		globals: true, // use `test` and `expect` without importing
		environment: "jsdom", // simulate browser environment
		setupFiles: "./src/setupTests.js", // optional for jest-dom matchers
	},
});
