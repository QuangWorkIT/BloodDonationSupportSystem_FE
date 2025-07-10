const bloodTypeMapping = new Map<string, number>([
  ["A+", 1],
  ["A-", 2],
  ["B+", 3],
  ["B-", 4],
  ["AB+", 5],
  ["AB-", 6],
  ["O+", 7],
  ["O-", 8]
]);

const bloodComponentMapping = new Map<string, number>([
  ["wholeblood", 0],
  ["redbloodcell", 1],
  ["plasma", 2],
  ["platelet", 3],
])
export interface bloodType {
  bloodType: string,
  rh: string
}

// return blood type id
export const getTypeId = (bloodType: string): number => {
  return bloodTypeMapping.get(bloodType) ?? 0

}

// return blood component id
export const getComponentId = (bloodComponent: string): number => {
  return bloodComponentMapping.get(bloodComponent) ?? -1
}


export const getBloodTypeRh = (type: string): bloodType => {
  return {
    bloodType: type.substring(0, 1),
    rh: type.substring(1)
  }
}