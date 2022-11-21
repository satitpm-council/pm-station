const and = (...query: string[]) => query.join(" and ");
const or = (...query: string[]) => query.join(" or ");

type Operator = "=" | "!=" | "contains" | "in";

const query = (key: string, operator: Operator, value: string) =>
  [key, operator, `${value}`].join(" ");

const isFolder = () =>
  query("mimeType", "=", "'application/vnd.google-apps.folder'");

const inFolder = (folderId: string) => query(`'${folderId}'`, "in", "parents");

export { and, or, query };
export { isFolder, inFolder };
