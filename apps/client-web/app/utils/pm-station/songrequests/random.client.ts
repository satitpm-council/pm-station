import type {
  Firestore,
  OrderByDirection,
  QueryConstraint,
  WhereFilterOp,
} from "firebase/firestore";
import { documentId } from "firebase/firestore";
import { limit } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { where } from "firebase/firestore";
import type { TypeOf } from "zod";
import { SongRequestRecord } from "~/schema/pm-station/songrequests/schema";
import { isString } from "~/utils/guards";
import { trackId } from "../spotify/trackId";
import { convertFirestoreData } from "./result";

const STRATEGY_COUNT = 4;
enum RandomStrategy {
  "Greater_ASC" = 0,
  "Greater_DESC" = 1,
  "Lesser_ASC" = 2,
  "Lesser_DESC" = 3,
}

type RandomStrategyResult = {
  op: ">=" | "<=";
  order: OrderByDirection;
};

const AllowedOp: RandomStrategyResult["op"][] = ["<=", ">="];

const __dangerouslyEvalMath = (
  a: string,
  op: RandomStrategyResult["op"],
  b: string
) => {
  if (
    !isString(a) ||
    !isString(op) ||
    !AllowedOp.includes(op) ||
    !isString(b)
  ) {
    throw new Error("Invalid arguments");
  }
  // eslint-disable-next-line no-new-func
  return Function(`'use strict'; return ("${a}" ${op} "${b}");`)();
};

const shuffleArray = <T>(input: T[]): T[] => {
  const array = input.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const fromRandomStrategy = (strategy: RandomStrategy): RandomStrategyResult => {
  let op: WhereFilterOp;
  let order: OrderByDirection;
  switch (strategy) {
    case RandomStrategy.Greater_ASC:
    case RandomStrategy.Greater_DESC:
      op = ">=";
      break;
    case RandomStrategy.Lesser_ASC:
    case RandomStrategy.Lesser_DESC:
      op = "<=";
  }
  switch (strategy) {
    case RandomStrategy.Greater_ASC:
    case RandomStrategy.Lesser_ASC:
      order = "asc";
      break;
    case RandomStrategy.Greater_DESC:
    case RandomStrategy.Lesser_DESC:
      order = "desc";
  }
  return {
    op,
    order,
  };
};

export default class RandomTrackSelector {
  private db: Firestore;
  private processedTrackIds: Set<string>;
  constructor(db: Firestore) {
    this.db = db;
    this.processedTrackIds = new Set();
  }

  private setProcessedTrackId(trackId: string) {
    const array = Array.from(this.processedTrackIds.values());
    array.push(trackId);
    this.processedTrackIds = new Set(array.sort());
  }

  private getNotInCaluse(
    trackId: string,
    op: RandomStrategyResult["op"]
  ): QueryConstraint[] {
    const array = Array.from(this.processedTrackIds.values());
    const closestIndex = array.findIndex((id) =>
      __dangerouslyEvalMath(id, op, trackId)
    );
    return closestIndex > -1
      ? [where(documentId(), "not-in", array.slice(closestIndex).slice(0, 10))]
      : [];
  }

  /**
   * Returns the randomized track based on the given trackId and RandomStrategy.
   * @param trackId Track ID
   * @param strategy Random stretegy to be used.
   */
  async getRandomTrackByStrategy(trackId: string, strategy: RandomStrategy) {
    const { op, order } = fromRandomStrategy(strategy);
    const notIn = this.getNotInCaluse(trackId, op);
    const { docs } = await getDocs(
      query(
        collection(this.db, "/songrequests"),
        where("lastPlayedAt", "==", null),
        where(documentId(), op, trackId),
        ...notIn,
        orderBy(documentId(), order),
        limit(1)
      )
    );
    if (docs.length !== 0) {
      const data = convertFirestoreData(docs[0], SongRequestRecord);
      if (data && !this.processedTrackIds.has(data.id)) {
        this.setProcessedTrackId(data.id);
        return data;
      }
    }
  }

  /**
   * Returns the randomized from any possible RandomStrategy.
   * Track ID will be automatically generated.
   */
  async getRandomTrack(): Promise<
    TypeOf<typeof SongRequestRecord> | undefined
  > {
    const id = await trackId();
    const strategies = shuffleArray(Array.from(Array(STRATEGY_COUNT).keys()));
    for (let i = 0; i < 4; i++) {
      const random = await this.getRandomTrackByStrategy(id, strategies[i]);
      if (random) return random;
    }
  }

  async getRandomTracks(
    size: number
  ): Promise<TypeOf<typeof SongRequestRecord>[]> {
    const selectedIds = new Set<string>();
    const selected = new Set<TypeOf<typeof SongRequestRecord>>();
    while (selected.size !== size) {
      const pendingSize = size - selected.size;
      await Promise.all(
        Array(pendingSize)
          .fill(undefined)
          .map(async () => {
            const value = await this.getRandomTrack();
            if (value && !selectedIds.has(value.id)) {
              selected.add(value);
              this.setProcessedTrackId(value.id);
              selectedIds.add(value.id);
            }
          })
      );
    }

    return Array.from(selected.values());
  }
}
