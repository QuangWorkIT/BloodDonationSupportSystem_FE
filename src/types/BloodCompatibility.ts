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

export const getTypeId = (bloodType: string): number => {
    return bloodTypeMapping.get(bloodType) ?? 0
}