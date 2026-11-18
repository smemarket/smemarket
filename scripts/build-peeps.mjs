// Pre-renders every Open Peeps character the site can show (cast × mood × body) to a static SVG,
// so the ~2 MB react-peeps library never ships to the browser.
// Output: public/peeps/<who>-<mood>-<body>.svg (git-ignored, rebuilt before dev and every build).
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const Peep = require("react-peeps").default;

const { faces, bodies, cast } = JSON.parse(await readFile(path.join(process.cwd(), "src/lib/cast.json"), "utf8"));
const out = path.join(process.cwd(), "public/peeps");
await mkdir(out, { recursive: true });

let n = 0;
for (const [who, c] of Object.entries(cast)) {
  for (const [mood, face] of Object.entries(faces)) {
    for (const body of bodies) {
      const svg = renderToStaticMarkup(
        React.createElement(Peep, {
          // default frame is 0 0 850 1200 and clips tall hair (buns); give it headroom
          viewBox: { x: "-50", y: "-130", width: "950", height: "1330" },
          body,
          face,
          hair: c.hair,
          facialHair: c.facialHair ?? "None",
          accessory: c.accessory ?? "None",
          strokeColor: "#15130f",
          backgroundColor: "#fbf9f4",
        }),
      ).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
      await writeFile(path.join(out, `${who}-${mood}-${body}.svg`), svg);
      n++;
    }
  }
}
console.log(`peeps: ${n} characters written to public/peeps`);
