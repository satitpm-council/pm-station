import dayjs from "dayjs";
import th from "dayjs/locale/th";
import localizedFormat from "dayjs/plugin/localizedFormat";
import duration from "dayjs/plugin/duration";

dayjs.locale(th);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

export default dayjs;
