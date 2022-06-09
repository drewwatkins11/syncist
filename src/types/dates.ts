type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type d = oneToNine | 0;

type DD = `${0}${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`;
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
type YYYY = `20${d}${d}`;

export type DateYMDString = `${YYYY}-${MM}-${DD}`;
