type RatingAggregate = {
  count: number;
  sum: number;
};

const globalForRatings = globalThis as typeof globalThis & {
  __ratingStore?: Map<string, RatingAggregate>;
};

const store = globalForRatings.__ratingStore ?? new Map<string, RatingAggregate>();

if (!globalForRatings.__ratingStore) {
  globalForRatings.__ratingStore = store;
}

export function getRatingStats(key: string) {
  const current = store.get(key) ?? { count: 0, sum: 0 };

  return {
    count: current.count,
    average: current.count > 0 ? current.sum / current.count : 0,
  };
}

export function upsertRating(
  key: string,
  previousRating: number,
  newRating: number
) {
  const current = store.get(key) ?? { count: 0, sum: 0 };

  let nextCount = current.count;
  let nextSum = current.sum;

  if (previousRating > 0) {
    nextSum -= previousRating;
  } else {
    nextCount += 1;
  }

  nextSum += newRating;

  const nextValue = {
    count: Math.max(0, nextCount),
    sum: Math.max(0, nextSum),
  };

  store.set(key, nextValue);

  return {
    count: nextValue.count,
    average: nextValue.count > 0 ? nextValue.sum / nextValue.count : 0,
  };
}

export function removeRating(key: string, previousRating: number) {
  const current = store.get(key) ?? { count: 0, sum: 0 };

  if (previousRating <= 0 || current.count <= 0) {
    return {
      count: current.count,
      average: current.count > 0 ? current.sum / current.count : 0,
    };
  }

  const nextCount = Math.max(0, current.count - 1);
  const nextSum = Math.max(0, current.sum - previousRating);

  const nextValue = {
    count: nextCount,
    sum: nextSum,
  };

  if (nextCount === 0) {
    store.delete(key);
  } else {
    store.set(key, nextValue);
  }

  return {
    count: nextValue.count,
    average: nextValue.count > 0 ? nextValue.sum / nextValue.count : 0,
  };
}