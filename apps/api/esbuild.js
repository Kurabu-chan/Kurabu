require('esbuild').buildSync({
	entryPoints: ["src/start.ts"],
	bundle: true,
	platform: "node",
	target: ["esnext"],
	outfile: "dist/outfile.js",
    tsconfig: "tsconfig.json",
    external: ["pg-hstore"],
    sourcemap: true,
});
