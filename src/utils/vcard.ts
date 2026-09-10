import { resume } from "../data/resume";

export function downloadVCard() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:Hessen;Daan;;;
FN:Daan Hessen
TITLE:${resume.personal.position}
EMAIL;type=INTERNET;type=WORK:${resume.personal.email}
URL:https://daanhessen.nl
END:VCARD`;

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Daan_Hessen.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
