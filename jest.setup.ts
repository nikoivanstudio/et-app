import "@testing-library/jest-dom";

process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA = "true";
process.env.BROWSERSLIST_IGNORE_OLD_DATA = "true";

type EmitWarningOptions = {
  type?: string;
  code?: string;
  detail?: string;
};

const originalEmitWarning = process.emitWarning;
process.emitWarning = ((warning: string | Error, ...args: unknown[]) => {
  const message =
    typeof warning === "string" ? warning : warning?.message || "";
  const code = typeof args[0] === "string" ? args[0] : undefined;

  if (code === "DEP0040" || message.includes("punycode")) {
    return;
  }

  if (typeof args[0] === "string") {
    const type = args[0];
    const codeArg = typeof args[1] === "string" ? args[1] : undefined;
    return originalEmitWarning(warning, type, codeArg);
  }

  if (
    args[0] &&
    typeof args[0] === "object" &&
    "type" in args[0] &&
    typeof (args[0] as { type?: unknown }).type === "string"
  ) {
    return originalEmitWarning(warning, args[0] as EmitWarningOptions);
  }

  return originalEmitWarning(warning);
}) as typeof process.emitWarning;
