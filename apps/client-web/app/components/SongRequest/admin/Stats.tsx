import { useConnector } from "react-instantsearch-hooks-web";
import type {
  StatsWidgetDescription,
  StatsConnectorParams,
} from "instantsearch.js/es/connectors/stats/connectStats";
import connectStats from "instantsearch.js/es/connectors/stats/connectStats";

export function useStats() {
  return useConnector<StatsConnectorParams, StatsWidgetDescription>(
    connectStats
  );
}

export default function Stats() {
  const { nbHits } = useStats();

  return (
    <p className="leading-6 self-center">แสดงผลลัพธ์ทั้งหมด {nbHits} รายการ</p>
  );
}
