/**
 * Tiny gate between the page-transition cover and on-mount intro animations.
 * While the loader or a page wipe covers the screen, intros wait, then play as the cover lifts.
 */
let covered = false;
let queue: (() => void)[] = [];

export function setCovered(v: boolean) {
  covered = v;
  if (!v) {
    const q = queue;
    queue = [];
    q.forEach((f) => f());
  }
}

/** Runs `fn` now if nothing covers the page, otherwise the moment the cover starts lifting. Returns a canceller. */
export function onReveal(fn: () => void) {
  if (!covered) {
    fn();
    return () => {};
  }
  queue.push(fn);
  return () => {
    queue = queue.filter((f) => f !== fn);
  };
}
