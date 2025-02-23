import { generateTitle } from "./ai";

const notes = [
  `obecnie jest project managerem w solvro i prowadzi projekt ledcube3d, która ma mieć swoją premierę 13 marca na dniach aktywności studenckiej

po tym chce się zająć bardziej frontendem`,
];

for (const note of notes) {
  // eslint-disable-next-line no-console
  console.log(await generateTitle(note));
}
