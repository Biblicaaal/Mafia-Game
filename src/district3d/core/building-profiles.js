export const colorByCategory = {
  Residential: { wall: 0xbfa77d, roof: 0x6f5a45 },
  Commercial: { wall: 0x9fb1bd, roof: 0x4c5d69 },
  Industrial: { wall: 0x5e6264, roof: 0x303436 },
  Civic: { wall: 0xd3d0c1, roof: 0x817d70 },
  Criminal: { wall: 0x603636, roof: 0x242426 },
};

const parcelBuildingDb = [
  { category: 'Residential', subtype: 'Small House', min: 80, max: 250, floors: [1, 2], height: [3, 6], footprint: [0.5, 0.8] },
  { category: 'Residential', subtype: 'Duplex', min: 150, max: 400, floors: [2, 3], height: [6, 9], footprint: [0.6, 0.85] },
  { category: 'Residential', subtype: 'Apartment Building', min: 300, max: 1200, floors: [3, 8], height: [9, 24], footprint: [0.6, 0.9] },
  { category: 'Residential', subtype: 'Luxury Condo', min: 500, max: 2500, floors: [5, 15], height: [15, 45], footprint: [0.4, 0.7] },
  { category: 'Residential', subtype: 'Mansion', min: 1000, max: 6000, floors: [1, 3], height: [3, 12], footprint: [0.2, 0.5] },
  { category: 'Commercial', subtype: 'Corner Shop', min: 80, max: 300, floors: [1, 2], height: [3, 8], footprint: [0.7, 0.95] },
  { category: 'Commercial', subtype: 'Restaurant', min: 150, max: 600, floors: [1, 3], height: [3, 12], footprint: [0.6, 0.9] },
  { category: 'Commercial', subtype: 'Bar / Club', min: 200, max: 1000, floors: [1, 3], height: [4, 12], footprint: [0.7, 0.95] },
  { category: 'Commercial', subtype: 'Office Building', min: 400, max: 3000, floors: [4, 15], height: [12, 45], footprint: [0.5, 0.85] },
  { category: 'Commercial', subtype: 'Shopping Center', min: 3000, max: 15000, floors: [1, 4], height: [5, 20], footprint: [0.7, 0.95] },
  { category: 'Commercial', subtype: 'Hotel', min: 1000, max: 5000, floors: [5, 20], height: [15, 60], footprint: [0.5, 0.85] },
  { category: 'Industrial', subtype: 'Workshop', min: 300, max: 1500, floors: [1, 2], height: [4, 8], footprint: [0.7, 0.95] },
  { category: 'Industrial', subtype: 'Warehouse', min: 1000, max: 10000, floors: [1, 2], height: [5, 12], footprint: [0.8, 0.95] },
  { category: 'Industrial', subtype: 'Factory', min: 2000, max: 30000, floors: [1, 5], height: [5, 25], footprint: [0.6, 0.9] },
  { category: 'Industrial', subtype: 'Heavy Industry', min: 5000, max: 100000, floors: [1, 6], height: [8, 40], footprint: [0.5, 0.85] },
  { category: 'Civic', subtype: 'Clinic', min: 300, max: 2000, floors: [1, 4], height: [3, 15], footprint: [0.5, 0.8] },
  { category: 'Civic', subtype: 'School', min: 1000, max: 10000, floors: [1, 4], height: [4, 16], footprint: [0.3, 0.7] },
  { category: 'Civic', subtype: 'Police Station', min: 500, max: 5000, floors: [2, 5], height: [6, 20], footprint: [0.4, 0.8] },
  { category: 'Civic', subtype: 'Courthouse', min: 1000, max: 8000, floors: [2, 6], height: [8, 25], footprint: [0.3, 0.7] },
  { category: 'Civic', subtype: 'Bank Branch', min: 300, max: 2000, floors: [1, 4], height: [4, 16], footprint: [0.5, 0.9] },
  { category: 'Civic', subtype: 'Hospital', min: 2000, max: 20000, floors: [3, 12], height: [12, 50], footprint: [0.4, 0.8] },
];

export function buildingProfilesFor(category, parcelArea, style) {
  const exact = parcelBuildingDb.filter((profile) => profile.category === category && parcelArea >= profile.min && parcelArea <= profile.max);
  const densityTallOk = style === 'DOWNTOWN' || style === 'NIGHTLIFE';
  const filteredExact = exact.filter((profile) => densityTallOk || profile.floors[1] <= 8);
  if (filteredExact.length) return filteredExact;
  if (exact.length) return exact;
  const sameCategory = parcelBuildingDb.filter((profile) => profile.category === category);
  if (!sameCategory.length) return parcelBuildingDb.filter((profile) => profile.category === 'Commercial');
  return sameCategory
    .slice()
    .sort((a, b) => Math.min(Math.abs(parcelArea - a.min), Math.abs(parcelArea - a.max)) - Math.min(Math.abs(parcelArea - b.min), Math.abs(parcelArea - b.max)))
    .slice(0, 3);
}

export function profileForSubtype(category, subtype) {
  return parcelBuildingDb.find((profile) => profile.category === category && profile.subtype === subtype)
    || parcelBuildingDb.find((profile) => profile.subtype === subtype)
    || null;
}

export function typeForCategory(category, rand, parcelArea, style) {
  if (category === 'Criminal') category = 'Commercial';
  const list = buildingProfilesFor(category, parcelArea, style);
  return list[Math.floor(rand() * list.length)];
}
