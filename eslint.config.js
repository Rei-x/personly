import { solvro } from "@solvro/config/eslint";

export default solvro({
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
  },
});
