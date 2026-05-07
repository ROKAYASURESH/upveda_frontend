import { toast, toastConfig } from "./showToast";
export const processTemplate = (template, variables) => {
  if (!template || typeof template !== "string") {
    return "";
  }

  const variableRegex = /\{([^}]+)\}/g;

  let processedTemplate = template.replace(variableRegex, (match, variableName) => {
    const cleanVariableName = variableName.trim();

    if (!variables.hasOwnProperty(cleanVariableName)) {
      toast.warning("Missing Data", toastConfig);
      return match;
    } else {
      return variables[cleanVariableName];
    }
  });
  processedTemplate = processedTemplate
    .replace(/<table>/g, `<table style="border-collapse: collapse; width: 100%; border: 1px solid black;">`)
    .replace(/<tr(.*?)>/g, `<tr style="border: 1px solid black;">`)
    .replace(/<td(.*?)>/g, `<td$1 style="border: 1px solid black; padding: 8px;">`)
    .replace(/<th(.*?)>/g, `<th$1 style="border: 1px solid black; padding: 8px; text-align: left;">`);

  return processedTemplate;
};
