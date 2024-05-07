import _ from "lodash"

export const toPercentage = (value: number) => {
  return (value * 100).toFixed(1) + '%'
}
