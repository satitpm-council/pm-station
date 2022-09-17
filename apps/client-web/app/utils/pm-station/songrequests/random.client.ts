import type {
  Firestore,
  OrderByDirection,
  QueryConstraint,
  WhereFilterOp,
} from "firebase/firestore";
import { limit } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { where } from "firebase/firestore";
import type { TypeOf } from "zod";
import { SongRequestRecord } from "~/schema/pm-station/songrequests/schema";
import { trackId } from "../spotify/trackId";
import { convertFirestoreData } from "./result";

const STRATEGY_COUNT = 4;
enum RandomStrategy {
  "Greater_ASC" = 0,
  "Greater_DESC" = 1,
  "Lesser_ASC" = 2,
  "Lesser_DESC" = 3,
}

const shuffleArray = <T>(input: T[]): T[] => {
  const array = input.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const fromRandomStrategy = (
  strategy: RandomStrategy,
  random: string
): QueryConstraint[] => {
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
  return [where("id", op, random), orderBy("id", order)];
};

export default class RandomTrackSelector {
  private db: Firestore;
  constructor(db: Firestore) {
    this.db = db;
  }

  /**
   * Returns the randomized track based on the given trackId and RandomStrategy.
   * @param trackId Track ID
   * @param strategy Random stretegy to be used.
   */
  async getRandomTrackByStrategy(trackId: string, strategy: RandomStrategy) {
    const { docs } = await getDocs(
      query(
        collection(this.db, "/songrequests"),
        ...fromRandomStrategy(strategy, trackId),
        limit(1)
      )
    );
    if (docs.length !== 0) {
      return convertFirestoreData(docs[0], SongRequestRecord);
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
      console.log(id, i, strategies[i]);
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
      console.log(pendingSize, selected.size, size);
      await Promise.all(
        Array(pendingSize)
          .fill(undefined)
          .map(async () => {
            const value = await this.getRandomTrack();
            if (value && !selectedIds.has(value.id)) {
              selected.add(value);
              selectedIds.add(value.id);
            }
          })
      );
    }

    return Array.from(selected.values());
  }
}
