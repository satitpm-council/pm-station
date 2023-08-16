import dayjs from "dayjs";
import th from "dayjs/locale/th";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale(th);
dayjs.extend(localizedFormat);

export default dayjs;
