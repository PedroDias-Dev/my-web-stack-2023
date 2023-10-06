import path from "path";

const __dirname = path.resolve();
const aliasConfig = {
  "@lib": path.resolve(__dirname, "../src/lib"),
  "@utils": path.resolve(__dirname, "../src/utils"),
  "@services": path.resolve(__dirname, "../src/services"),
  "@config": path.resolve(__dirname, "../src/config"),
  "@types": path.resolve(__dirname, "../src/types"),
  "@routes": path.resolve(__dirname, "../src/routes"),
};

export default aliasConfig;
