import type { ChangeEvent, ChangeEventHandler } from "react";
import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { useRefinementList } from "react-instantsearch-hooks-web";
import type { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import type { SongRequestSearchRecord } from "~/schema/pm-station/songrequests/types";

export type CustomLabelComponent = ({
  value,
}: {
  value: string;
}) => JSX.Element;

type Props = {
  title: string;
  attribute: keyof SongRequestSearchRecord;
  showMore?: boolean;
  searchable?: boolean;
  CustomLabel?: CustomLabelComponent;
};

export function RefinementList({
  title,
  attribute,
  searchable,
  CustomLabel,
}: Props) {
  const {
    items,
    refine,
    searchForItems,
    canToggleShowMore,
    isShowingMore,
    toggleShowMore,
    isFromSearch,
  } = useRefinementList({
    attribute,
    limit: 10,
    showMoreLimit: 20,
  });

  const [renderedItems, setRenderedItems] = useState<RefinementListItem[]>([]);

  // fix confusion that I uncheck everything but results not returning correctly!
  // because there are still selected filters, but API doesn't return.
  // this map is used to persist selected items, and make it always visible to user.
  const selectedItems = useRef<Map<string, RefinementListItem>>(new Map());

  // prevents items from flushing below immediately after selecting.
  const selectFromSearch = useRef<string | undefined>(undefined);

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      searchForItems(e.target.value);
      if (e.target.value !== selectFromSearch.current) {
        selectFromSearch.current = "";
      }
    },
    [searchForItems]
  );

  const onCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, refinement: RefinementListItem) => {
      const { value, isRefined, count } = refinement;
      if (selectedItems.current.has(value) && (isRefined || count === 0)) {
        // set to false, delete
        selectedItems.current.delete(value);
      } else {
        selectedItems.current.set(value, refinement);
      }
      refine(e.target.value);
      if (isFromSearch) {
        selectFromSearch.current = e.target.value;
      }
    },
    [refine, isFromSearch]
  );
  useEffect(() => {
    if (!selectFromSearch.current) {
      const itemsWithoutRefined = items.filter((refinement) => {
        if (selectedItems.current.has(refinement.value)) {
          selectedItems.current.set(refinement.value, refinement);
          return false;
        }
        return !refinement.isRefined;
      });
      setRenderedItems([
        ...Array.from(selectedItems.current.values()),
        ...itemsWithoutRefined,
      ]);
    }
  }, [items]);
  return (
    <form className="py-4">
      <fieldset className="flex flex-col space-y-4 items-start">
        <legend className="text-xl font-bold">{title}</legend>
        {searchable && (
          <input
            name="search"
            type="search"
            placeholder="ค้นหาจากตัวกรอง..."
            className="pm-station-input"
            style={{
              zoom: 0.9,
            }}
            onChange={onSearchChange}
            autoComplete="off"
          />
        )}
        <div className="w-full grid grid-cols-[max-content_1fr] text-left items-center gap-2 text-sm">
          {renderedItems.map(({ label, value, count, isRefined }) => (
            <Fragment key={label}>
              <input
                type="checkbox"
                id={`filter_${attribute}_${value}`}
                name={`filter_${attribute}_${value}`}
                value={value}
                defaultChecked={isRefined}
                onChange={(e) =>
                  onCheckboxChange(e, { label, value, count, isRefined })
                }
              />
              <label
                htmlFor={`filter_${attribute}_${value}`}
                className="w-full flex flex-row gap-2 items-center select-none"
              >
                <span
                  className={`font-light flex-grow w-full pr-2 max-w-[70%] ${
                    isRefined ? "text-green-400 font-medium" : "text-gray-200"
                  }`}
                >
                  {CustomLabel ? <CustomLabel value={label} /> : label}
                </span>
                <span
                  className={`${
                    isRefined ? "bg-green-600" : "bg-zinc-800"
                  } text-white rounded-md px-2 py-1 text-xs`}
                >
                  {count}
                </span>
              </label>
            </Fragment>
          ))}
        </div>
        {canToggleShowMore && (
          <button
            type="button"
            onClick={() => toggleShowMore()}
            className="bg-blue-500 hover:bg-blue-500 disabled:bg-blue-200 text-xs text-white pm-station-btn"
          >
            {isShowingMore ? "ซ่อนรายการเพิ่มเติม" : "ขยายรายการเพิ่มเติม"}
          </button>
        )}
      </fieldset>
    </form>
  );
}
