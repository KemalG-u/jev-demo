// Yalnız en son başlatılan ve hâlâ geçerli istek arayüzü güncelleyebilir.
export function createRequestGate() {
  let generation = 0
  return {
    begin: () => ++generation,
    invalidate: () => { generation++ },
    current: (id: number) => id === generation,
  }
}
