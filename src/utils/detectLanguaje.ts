import languagedetect from "languagedetect";

const detectLanguaje = (text: string) => {
  const lang = new languagedetect();
  const langs = lang.detect(text, 1);
  return langs.find((l) => l[0] === "spanish") ? "es" : "ja";
};

export default detectLanguaje;
