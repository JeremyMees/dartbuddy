/** Converts Date fields to string to match useFetch/useLazyFetch serialization */
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}
