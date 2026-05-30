import { useEffect, useMemo, useState } from 'react';

import { useRef } from 'react';
import type { MouseEvent, WheelEvent } from 'react';

type TimeBlock = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
type Tab = 'Dashboard' | 'Calendar' | 'Inbox' | 'City' | 'District' | 'Crew' | 'Tasks' | 'Opportunities' | 'Fronts' | 'Rackets' | 'Rivals';
type Importance = 'low' | 'normal' | 'important' | 'critical';
type TaskType = 'scout_racket' | 'investigate_front' | 'pressure_owner' | 'set_up_racket' | 'launder_money' | 'bribe_official' | 'recruit_crew' | 'gather_intel' | 'sabotage_rival' | 'lay_low';
type Status = 'active' | 'completed' | 'failed' | 'cancelled';

type Crew = { id: string; name: string; rank: string; loyalty: number; violence: number; intelligence: number; charisma: number; stealth: number; greed: number; stress: number; heat: number; status: 'available' | 'assigned' | 'injured' | 'arrested' | 'hiding' | 'dead'; taskId?: string; traits: string[] };
type District = { id: string; name: string; wealth: number; police: number; corruption: number; fear: number; order: number; control: number; rival: number };
type Opportunity = { id: string; type: 'racket' | 'front' | 'contact' | 'rival_weakness' | 'political_favor'; districtId: string; title: string; body: string; discovered: boolean; value: string; risk: string; sourceTaskId?: string; discoveryDay?: number };
type Task = { id: string; title: string; type: TaskType; crewIds: string[]; districtId?: string; startDay: number; endDay: number; progress: number; required: number; status: Status; risk: 'low' | 'medium' | 'high'; result?: string; unread: boolean; interrupts: boolean; amountRemaining?: number };
type Message = { id: string; day: number; time: TimeBlock; type: 'Report' | 'Alert' | 'Opportunity' | 'Threat' | 'Financial' | 'Personal' | 'Police' | 'Rival' | 'Weekly Summary'; title: string; body: string; importance: Importance; read: boolean; requiresResponse: boolean };
type Front = { id: string; name: string; districtId: string; owned: boolean; cleanWeekly: number; laundering: number; suspicion: number };
type Racket = { id: string; name: string; districtId: string; min: number; max: number; heat: number; manpower: number };
type Rival = { id: string; name: string; known: boolean; vendetta: number; territory: string[]; income: string; intel: string[] };
type Weekly = { clean: number; dirty: number; laundered: number; racketProfits: number; frontProfits: number; crew: string[]; heat: number; police: number; rivals: string[]; opps: string[]; tasks: string[]; warnings: string[] };
type Game = { day: number; time: TimeBlock; simulating: boolean; stopReason: string; dirty: number; clean: number; rep: number; heat: number; police: number; family: string; districts: District[]; crew: Crew[]; opportunities: Opportunity[]; tasks: Task[]; messages: Message[]; fronts: Front[]; rackets: Racket[]; rivals: Rival[]; weekly: Weekly };
type Point = { x: number; y: number };
type Parcel = { id: string; blockId: string; label: string; kind: string; polygon: Point[]; size: number; value: number; heat: number; occupiedBy: 'unknown' | 'neutral' | 'player' | 'rival' | 'police' };
type Block = { id: string; label: string; polygon: Point[]; pressure: number; parcels: Parcel[] };
type Road = { id: string; path: string; width: number; kind: 'major' | 'minor' };
type Landmark = { id: string; label: string; kind: string; point: Point };
type DistrictLayout = { outerPolygon: Point[]; blocks: Block[]; roads: Road[]; landmarks: Landmark[] };

const blocks: TimeBlock[] = ['Morning', 'Afternoon', 'Evening', 'Night'];
const tabs: Tab[] = ['Dashboard', 'Calendar', 'Inbox', 'City', 'District', 'Crew', 'Tasks', 'Opportunities', 'Fronts', 'Rackets', 'Rivals'];
const saveKey = 'desk-don-mafia-save-v1';
const taskNames: Record<TaskType, string> = {
  scout_racket: 'Scout Potential Racket',
  investigate_front: 'Investigate Front Business',
  pressure_owner: 'Pressure Business Owner',
  set_up_racket: 'Set Up Racket',
  launder_money: 'Launder Money Through Front',
  bribe_official: 'Bribe Official',
  recruit_crew: 'Recruit Crew Member',
  gather_intel: 'Gather Intel on Rival Family',
  sabotage_rival: 'Sabotage Rival Operation',
  lay_low: 'Lay Low',
};

const mapDistricts: Record<string, { island: string; label: string; points: string; cx: number; cy: number }> = {
  dockside: { island: 'West Island', label: 'Dockside', points: '92,438 164,400 220,418 230,530 184,614 96,584 76,505', cx: 150, cy: 518 },
  riverside: { island: 'West Island', label: 'Riverside', points: '76,214 124,136 214,150 252,252 220,418 164,400 96,354', cx: 158, cy: 278 },
  south_yards: { island: 'West Island', label: 'South Yards', points: '214,150 292,192 324,286 304,392 230,530 220,418 252,252', cx: 265, cy: 326 },
  little_italy: { island: 'Central Island', label: 'Little Italy', points: '410,172 526,148 628,190 632,300 516,320 404,286', cx: 514, cy: 226 },
  financial: { island: 'Central Island', label: 'Financial', points: '404,286 516,320 632,300 666,430 636,586 514,632 410,586', cx: 536, cy: 456 },
  old_town: { island: 'Central Island', label: 'Old Town', points: '354,246 410,172 404,286 410,586 366,640 328,532 334,374', cx: 374, cy: 424 },
  midtown: { island: 'Central Island', label: 'Midtown', points: '636,586 666,430 632,300 706,322 738,444 716,548 686,620', cx: 682, cy: 466 },
  ironworks: { island: 'North Island', label: 'Ironworks', points: '770,136 866,100 988,124 1034,194 982,284 858,294 762,232', cx: 896, cy: 196 },
  railhead: { island: 'North Island', label: 'Railhead', points: '762,232 858,294 982,284 1030,350 996,434 872,428 762,354', cx: 896, cy: 354 },
  uptown: { island: 'East Island', label: 'Uptown', points: '776,486 900,452 1008,492 1018,604 904,646 782,604', cx: 900, cy: 546 },
  garden_heights: { island: 'East Island', label: 'Garden', points: '1008,492 1102,534 1076,664 1010,716 904,646 1018,604', cx: 1014, cy: 612 },
  airport: { island: 'East Island', label: 'Airport', points: '782,604 904,646 1010,716 930,784 786,742 724,664', cx: 866, cy: 696 },
};

const islandMasses = [
  'M70 210 L118 128 L190 138 L228 158 L294 194 L330 282 L314 398 L268 512 L190 626 L96 592 L70 514 L48 444 L92 416 L72 354 L54 276 Z',
  'M350 244 L408 166 L526 142 L632 184 L714 320 L746 444 L720 550 L686 626 L620 596 L516 638 L410 590 L365 642 L326 536 L332 374 Z',
  'M768 134 L864 98 L990 120 L1040 194 L986 286 L1036 350 L1000 438 L872 432 L760 354 L758 232 Z',
  'M776 486 L902 448 L1012 490 L1106 532 L1078 666 L1008 720 L930 786 L786 744 L722 664 L780 604 Z',
];

const mapBridges = [
  'M306 352 L350 330',
  'M308 514 L332 502',
  'M704 322 L760 286',
  'M714 540 L778 570',
  'M1000 438 L1030 492',
];

const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const copy = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function seeded(seed: string) {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeDistrictLayout(district: District): DistrictLayout {
  const rand = seeded(district.id);
  const outerPolygon = makeDistrictOuterPolygon(district);
  const { blockPolygons, roads } = generateDistrictSkeleton(outerPolygon, district, rand);
  const blocks: Block[] = blockPolygons.map((polygon, index) => {
    const blockId = `${district.id}_b${index}`;
    return {
      id: blockId,
      label: `Block ${String.fromCharCode(65 + index)}`,
      polygon,
      pressure: Math.round((district.fear + district.rival + district.police) / 3 + rand() * 12),
      parcels: generateParcelsForBlock(polygon, blockId, district, rand),
    };
  });
  const landmarks = generateLandmarks(outerPolygon, district, rand);

  return { outerPolygon, roads, blocks, landmarks };
}

function parsePoints(points: string): Point[] {
  return points.split(' ').map((pair) => {
    const [x, y] = pair.split(',').map(Number);
    return { x, y };
  });
}

function districtMapArea(districtId: string): number {
  return Math.round(polygonArea(parsePoints(mapDistricts[districtId]?.points ?? mapDistricts.dockside.points)));
}

function makeDistrictOuterPolygon(district: District): Point[] {
  const source = parsePoints(mapDistricts[district.id]?.points ?? mapDistricts.dockside.points);
  const bounds = polygonBounds(source);
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const sourceArea = polygonArea(source);
  const allAreas = Object.values(mapDistricts).map((shape) => polygonArea(parsePoints(shape.points)));
  const minArea = Math.min(...allAreas);
  const maxArea = Math.max(...allAreas);
  const normalizedArea = (sourceArea - minArea) / Math.max(1, maxArea - minArea);
  const targetArea = 115000 + normalizedArea * 125000;
  const areaScale = Math.sqrt(targetArea / Math.max(1, sourceArea));
  const scale = Math.min(760 / width, 520 / height, areaScale);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const offsetX = (800 - scaledWidth) / 2;
  const offsetY = (560 - scaledHeight) / 2;
  return source.map((point) => ({
    x: offsetX + (point.x - bounds.minX) * scale,
    y: offsetY + (point.y - bounds.minY) * scale,
  }));
}

function generateDistrictSkeleton(outerPolygon: Point[], district: District, rand: () => number): { blockPolygons: Point[][]; roads: Road[] } {
  const bounds = polygonBounds(outerPolygon);
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const districtArea = polygonArea(outerPolygon);
  const columns = Math.max(5, Math.min(9, Math.round(width / 86) + (district.wealth > 72 ? 1 : 0)));
  const rows = Math.max(4, Math.min(7, Math.round(height / 92) + (district.order > 68 ? 1 : 0)));
  const xCuts = makeCuts(bounds.minX, bounds.maxX, columns, rand);
  const yCuts = makeCuts(bounds.minY, bounds.maxY, rows, rand);
  const blockPolygons: Point[][] = [];

  for (let row = 0; row < yCuts.length - 1; row += 1) {
    for (let col = 0; col < xCuts.length - 1; col += 1) {
      const clipped = clipPolygonToBounds(outerPolygon, xCuts[col], xCuts[col + 1], yCuts[row], yCuts[row + 1]);
      if (clipped.length >= 3 && polygonArea(clipped) > Math.max(700, districtArea / 150)) blockPolygons.push(clipped);
    }
  }

  const roads: Road[] = [
    ...xCuts.slice(1, -1).map((x, index) => ({
      id: `v${index}`,
      path: `M ${x.toFixed(1)} ${bounds.minY - 24} L ${x.toFixed(1)} ${bounds.maxY + 24}`,
      width: index === Math.floor((xCuts.length - 2) / 2) ? 24 : 14,
      kind: index === Math.floor((xCuts.length - 2) / 2) ? 'major' as const : 'minor' as const,
    })),
    ...yCuts.slice(1, -1).map((y, index) => ({
      id: `h${index}`,
      path: `M ${bounds.minX - 24} ${y.toFixed(1)} L ${bounds.maxX + 24} ${y.toFixed(1)}`,
      width: index === Math.floor((yCuts.length - 2) / 2) ? 24 : 14,
      kind: index === Math.floor((yCuts.length - 2) / 2) ? 'major' as const : 'minor' as const,
    })),
  ];

  return { blockPolygons: blockPolygons.slice(0, 42), roads };
}

function makeCuts(min: number, max: number, count: number, rand: () => number): number[] {
  const span = max - min;
  const weights = Array.from({ length: count }, () => 0.65 + rand() * 0.9);
  const total = weights.reduce((sum, value) => sum + value, 0);
  const cuts = [min];
  let cursor = min;
  weights.forEach((weight) => {
    cursor += span * weight / total;
    cuts.push(cursor);
  });
  cuts[cuts.length - 1] = max;
  return cuts;
}

function clipPolygonToBounds(polygon: Point[], minX: number, maxX: number, minY: number, maxY: number): Point[] {
  let clipped = splitPolygon(polygon, 'x', minX)[1];
  clipped = splitPolygon(clipped, 'x', maxX)[0];
  clipped = splitPolygon(clipped, 'y', minY)[1];
  clipped = splitPolygon(clipped, 'y', maxY)[0];
  return clipped;
}

function clipPolygonToPolygon(subject: Point[], clipper: Point[]): Point[] {
  const orientation = signedPolygonArea(clipper) >= 0 ? 1 : -1;
  return clipper.reduce((output, edgeStart, index) => {
    if (!output.length) return output;
    const edgeEnd = clipper[(index + 1) % clipper.length];
    const input = output;
    const result: Point[] = [];
    const inside = (point: Point) => orientation * cross(edgeStart, edgeEnd, point) >= -0.001;
    for (let i = 0; i < input.length; i += 1) {
      const current = input[i];
      const previous = input[(i + input.length - 1) % input.length];
      const currentInside = inside(current);
      const previousInside = inside(previous);
      if (currentInside !== previousInside) result.push(lineIntersection(previous, current, edgeStart, edgeEnd));
      if (currentInside) result.push(current);
    }
    return result;
  }, subject);
}

function signedPolygonArea(polygon: Point[]): number {
  return polygon.reduce((total, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return total + point.x * next.y - next.x * point.y;
  }, 0) / 2;
}

function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function lineIntersection(a: Point, b: Point, c: Point, d: Point): Point {
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denominator) < 0.001) return b;
  const aDet = a.x * b.y - a.y * b.x;
  const cDet = c.x * d.y - c.y * d.x;
  return {
    x: (aDet * (c.x - d.x) - (a.x - b.x) * cDet) / denominator,
    y: (aDet * (c.y - d.y) - (a.y - b.y) * cDet) / denominator,
  };
}

function generateLandmarks(outerPolygon: Point[], district: District, rand: () => number): Landmark[] {
  const labels = [
    { label: district.police > 60 ? 'Precinct' : 'Station', kind: 'police' },
    { label: district.wealth > 70 ? 'Bank' : 'Market', kind: 'front' },
    { label: district.corruption > 60 ? 'Club' : 'Office', kind: 'racket' },
  ];
  const bounds = polygonBounds(outerPolygon);
  return labels.map((item, index) => {
    for (let attempt = 0; attempt < 18; attempt += 1) {
      const point = {
        x: bounds.minX + (bounds.maxX - bounds.minX) * (0.24 + rand() * 0.52),
        y: bounds.minY + (bounds.maxY - bounds.minY) * (0.22 + rand() * 0.56),
      };
      if (pointInPolygon(point, outerPolygon)) return { id: `${district.id}_landmark_${index}`, ...item, point };
    }
    return { id: `${district.id}_landmark_${index}`, ...item, point: polygonCentroid(outerPolygon) };
  });
}

function polygonArea(polygon: Point[]): number {
  const sum = polygon.reduce((total, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return total + point.x * next.y - next.x * point.y;
  }, 0);
  return Math.abs(sum) / 2;
}

function polygonCentroid(polygon: Point[]): Point {
  const signedArea = polygon.reduce((total, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return total + point.x * next.y - next.x * point.y;
  }, 0) / 2;
  if (Math.abs(signedArea) < 0.01) {
    return polygon.reduce((acc, point) => ({ x: acc.x + point.x / polygon.length, y: acc.y + point.y / polygon.length }), { x: 0, y: 0 });
  }
  const centroid = polygon.reduce((acc, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    const factor = point.x * next.y - next.x * point.y;
    return { x: acc.x + (point.x + next.x) * factor, y: acc.y + (point.y + next.y) * factor };
  }, { x: 0, y: 0 });
  return { x: centroid.x / (6 * signedArea), y: centroid.y / (6 * signedArea) };
}

function polygonBounds(polygon: Point[]) {
  return polygon.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    maxX: Math.max(bounds.maxX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxY: Math.max(bounds.maxY, point.y),
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
}

function splitPolygon(polygon: Point[], axis: 'x' | 'y', at: number): [Point[], Point[]] {
  const clip = (keepLowerSide: boolean) => {
    const result: Point[] = [];
    const valueOf = (point: Point) => axis === 'x' ? point.x : point.y;
    const inside = (point: Point) => keepLowerSide ? valueOf(point) <= at : valueOf(point) >= at;
    for (let i = 0; i < polygon.length; i += 1) {
      const current = polygon[i];
      const previous = polygon[(i + polygon.length - 1) % polygon.length];
      const currentInside = inside(current);
      const previousInside = inside(previous);
      if (currentInside !== previousInside) {
        const span = valueOf(current) - valueOf(previous);
        const t = Math.abs(span) < 0.001 ? 0 : (at - valueOf(previous)) / span;
        result.push({
          x: axis === 'x' ? at : previous.x + (current.x - previous.x) * t,
          y: axis === 'y' ? at : previous.y + (current.y - previous.y) * t,
        });
      }
      if (currentInside) result.push(current);
    }
    return result;
  };
  return [clip(true), clip(false)];
}

function generateParcelsForBlock(blockPolygon: Point[], blockId: string, district: District, rand: () => number): Parcel[] {
  const parcelKinds = ['tenement', 'shop', 'warehouse', 'garage', 'bar', 'office', 'yard', 'club'];
  const owners: Parcel['occupiedBy'][] = ['unknown', 'neutral', 'neutral', 'player', 'rival', 'police'];
  const blockArea = polygonArea(blockPolygon);
  const targetCount = Math.max(12, Math.min(18, Math.round(blockArea / 760) + (district.wealth > 70 ? 1 : 0)));
  let leaves = generateStreetFrontageParcels(blockPolygon, targetCount, rand);
  if (leaves.length < 10) leaves = slicePolygonIntoStreetLots(blockPolygon, 'x', Math.max(10, targetCount), rand);
  const sortedAreas = leaves.map((piece) => polygonArea(piece)).sort((a, b) => a - b);
  return leaves.map((polygon, index) => {
    const area = polygonArea(polygon);
    const blockNumber = blockId.split('_b')[1] ?? '0';
    const areaRank = sortedAreas.findIndex((value) => value >= area) / Math.max(1, sortedAreas.length - 1);
    return {
      id: `${blockId}_p${index}`,
      blockId,
      label: `${blockNumber}-${index + 1}`,
      kind: parcelKinds[Math.floor(rand() * parcelKinds.length)],
      polygon,
      size: areaRank > 0.86 ? 4 : areaRank > 0.68 ? 3 : areaRank > 0.42 ? 2 : 1,
      value: Math.round(district.wealth * area / 1200 * (0.55 + rand() * 0.35)),
      heat: Math.round(district.police * (0.3 + rand() * 0.7)),
      occupiedBy: owners[Math.floor(rand() * owners.length)],
    };
  });
}

function generateStreetFrontageParcels(polygon: Point[], count: number, rand: () => number): Point[][] {
  const bounds = polygonBounds(polygon);
  const columnCount = count >= 16 ? 5 : 4;
  const middleRows = count >= 15 ? 3 : 2;
  const topDepth = 0.27 + rand() * 0.06;
  const bottomDepth = 0.27 + rand() * 0.06;
  const topY = bounds.minY + (bounds.maxY - bounds.minY) * topDepth;
  const bottomY = bounds.maxY - (bounds.maxY - bounds.minY) * bottomDepth;
  const xCuts = makeCuts(bounds.minX, bounds.maxX, columnCount, rand);
  const middleYCuts = makeCuts(topY, bottomY, middleRows, rand);
  const middleX = bounds.minX + (bounds.maxX - bounds.minX) * (0.48 + rand() * 0.04);
  const cells: Point[][] = [];

  for (let i = 0; i < xCuts.length - 1; i += 1) {
    cells.push(clipPolygonToBounds(polygon, xCuts[i], xCuts[i + 1], bounds.minY, topY));
    cells.push(clipPolygonToBounds(polygon, xCuts[i], xCuts[i + 1], bottomY, bounds.maxY));
  }
  for (let i = 0; i < middleYCuts.length - 1; i += 1) {
    cells.push(clipPolygonToBounds(polygon, bounds.minX, middleX, middleYCuts[i], middleYCuts[i + 1]));
    cells.push(clipPolygonToBounds(polygon, middleX, bounds.maxX, middleYCuts[i], middleYCuts[i + 1]));
  }

  return cells.filter((piece) => piece.length >= 3 && polygonArea(piece) > 8);
}

function slicePolygonIntoStreetLots(polygon: Point[], axis: 'x' | 'y', count: number, rand: () => number): Point[][] {
  const bounds = polygonBounds(polygon);
  const low = axis === 'x' ? bounds.minX : bounds.minY;
  const high = axis === 'x' ? bounds.maxX : bounds.maxY;
  const cuts = makeCuts(low, high, count, rand);
  const slices: Point[][] = [];

  for (let i = 0; i < cuts.length - 1; i += 1) {
    let slice = splitPolygon(polygon, axis, cuts[i])[1];
    slice = splitPolygon(slice, axis, cuts[i + 1])[0];
    if (slice.length >= 3 && polygonArea(slice) > 8) slices.push(slice);
  }
  return slices;
}

function renderPolygonPath(polygon: Point[]): string {
  if (!polygon.length) return '';
  return `M ${polygon.map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' L ')} Z`;
}

function renderPolylinePath(points: Point[]): string {
  if (!points.length) return '';
  return `M ${points.map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' L ')}`;
}

function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    const intersects = ((a.y > point.y) !== (b.y > point.y)) && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function getParcelAtPoint(point: Point, layout: DistrictLayout): Parcel | undefined {
  return layout.blocks.flatMap((block) => block.parcels).find((parcel) => pointInPolygon(point, parcel.polygon));
}

function dateLabel(day: number) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(1931, 0, 5 + day)));
}

function weekDay(day: number) {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day % 7];
}

function emptyWeekly(): Weekly {
  return { clean: 0, dirty: 0, laundered: 0, racketProfits: 0, frontProfits: 0, crew: [], heat: 0, police: 0, rivals: [], opps: [], tasks: [], warnings: [] };
}

function initialGame(): Game {
  const districts: District[] = [
    { id: 'dockside', name: 'Dockside', wealth: 44, police: 52, corruption: 61, fear: 20, order: 48, control: 8, rival: 38 },
    { id: 'riverside', name: 'Riverside', wealth: 67, police: 49, corruption: 55, fear: 16, order: 61, control: 9, rival: 29 },
    { id: 'south_yards', name: 'South Yards', wealth: 35, police: 41, corruption: 70, fear: 31, order: 39, control: 11, rival: 35 },
    { id: 'little_italy', name: 'Little Italy', wealth: 58, police: 44, corruption: 72, fear: 34, order: 57, control: 18, rival: 24 },
    { id: 'financial', name: 'Financial Ward', wealth: 88, police: 76, corruption: 35, fear: 8, order: 70, control: 4, rival: 18 },
    { id: 'old_town', name: 'Old Town', wealth: 52, police: 47, corruption: 63, fear: 22, order: 54, control: 10, rival: 26 },
    { id: 'midtown', name: 'Midtown', wealth: 73, police: 58, corruption: 49, fear: 14, order: 65, control: 6, rival: 22 },
    { id: 'ironworks', name: 'Ironworks', wealth: 39, police: 38, corruption: 68, fear: 27, order: 43, control: 13, rival: 42 },
    { id: 'railhead', name: 'Railhead', wealth: 46, police: 43, corruption: 66, fear: 25, order: 45, control: 7, rival: 37 },
    { id: 'uptown', name: 'Uptown', wealth: 82, police: 66, corruption: 41, fear: 11, order: 74, control: 3, rival: 21 },
    { id: 'garden_heights', name: 'Garden Heights', wealth: 79, police: 63, corruption: 38, fear: 10, order: 76, control: 2, rival: 16 },
    { id: 'airport', name: 'Municipal Airport', wealth: 69, police: 71, corruption: 44, fear: 9, order: 68, control: 1, rival: 19 },
  ];
  const crewData: [string, string, number, number, number, number, number, number, string[]][] = [
    ['Sal Vitale', 'soldier', 70, 68, 42, 39, 51, 31, ['steady hands']],
    ['Marta Bellini', 'associate', 74, 34, 73, 67, 66, 22, ['smooth talker', 'keeps books']],
    ['Nicky Russo', 'soldier', 62, 81, 31, 44, 38, 48, ['feared', 'short fuse']],
    ['Grace Moretti', 'capo', 83, 48, 78, 70, 61, 28, ['planner', 'hard bargain']],
    ['Tommy Vale', 'associate', 56, 39, 58, 52, 72, 36, ['light feet']],
    ['Frankie Lane', 'soldier', 67, 74, 46, 49, 45, 54, ['loyal bruiser']],
    ['Eddie Caruso', 'associate', 59, 42, 63, 56, 58, 40, ['knows clerks']],
    ['Rosa Greco', 'soldier', 77, 52, 69, 64, 70, 26, ['quiet pressure']],
  ];
  const opportunities: Opportunity[] = [
    ['racket', 'dockside', 'Backroom Gambling', 'A closed social club hosts dice games after midnight.', '$850-$1,400', 'medium'],
    ['front', 'little_italy', 'Union Laundry', 'A cash-heavy laundry could clean modest weekly sums.', '$600-$1,000 capacity', 'low'],
    ['contact', 'financial', 'Courthouse Clerk', 'A clerk can misplace small filings for a price.', 'case delays', 'medium'],
    ['racket', 'dockside', 'Dock Theft Crew', 'Longshoremen whisper about missing crates.', '$1,100-$2,000', 'high'],
    ['front', 'riverside', 'Cigar Lounge', 'A respectable lounge needs protection from rough customers.', '$900-$1,600 capacity', 'medium'],
    ['rival_weakness', 'ironworks', 'Unpaid Enforcer', 'A rival crewman is angry about short envelopes.', 'sabotage angle', 'high'],
    ['political_favor', 'uptown', 'Alderman Nephew', 'A small scandal could become useful leverage.', 'permit influence', 'medium'],
    ['racket', 'little_italy', 'Numbers Bank', 'Barbershops pass slips through back doors.', '$750-$1,250', 'medium'],
    ['front', 'dockside', 'Fish Market', 'The books are loose and the owner is tired.', '$500-$900 capacity', 'low'],
    ['racket', 'ironworks', 'Truck Hijack Tip', 'Routes from the depot are predictable.', '$1,400-$2,300', 'high'],
    ['contact', 'riverside', 'Vice Detective', 'A detective drinks too much and owes too much.', 'heat relief', 'high'],
    ['front', 'uptown', 'Funeral Home', 'Quiet rooms, quiet books, quiet partners.', '$1,200-$2,000 capacity', 'medium'],
    ['racket', 'south_yards', 'Chop Shop Chain', 'Garages strip stolen cars behind corrugated doors.', '$900-$1,700', 'high'],
    ['front', 'old_town', 'Marble Room Cafe', 'A respectable cafe moves more cash than coffee.', '$700-$1,300 capacity', 'medium'],
    ['racket', 'midtown', 'Hotel Card Room', 'Night clerks know which suites never ask questions.', '$1,000-$1,800', 'medium'],
    ['contact', 'railhead', 'Rail Union Steward', 'A steward can slow freight or make it disappear.', 'shipment leverage', 'medium'],
    ['political_favor', 'garden_heights', 'Zoning Board Whisper', 'A zoning vote could make one property very useful.', 'real estate leverage', 'low'],
    ['racket', 'airport', 'Cargo Manifest Leak', 'A baggage supervisor knows which crates clear inspection.', '$1,300-$2,400', 'high'],
  ].map(([type, districtId, title, body, value, risk]) => ({ id: id('opp'), type: type as Opportunity['type'], districtId, title, body, value, risk, discovered: false }));
  const game: Game = {
    day: 0,
    time: 'Morning',
    simulating: false,
    stopReason: '',
    dirty: 12000,
    clean: 3500,
    rep: 20,
    heat: 12,
    police: 18,
    family: 'Moretti Family',
    districts,
    crew: crewData.map(([name, rank, loyalty, violence, intelligence, charisma, stealth, greed, traits]) => ({ id: id('crew'), name, rank, loyalty, violence, intelligence, charisma, stealth, greed, stress: 0, heat: 0, status: 'available', traits })),
    opportunities,
    tasks: [],
    messages: [],
    fronts: ['Rialto Florist', 'Blue Star Laundry', 'Crown Cigar Lounge', 'Harbor Fish Market', 'Saint Jude Funeral Home', 'Northline Taxi', 'Marble Room Cafe', 'Argent Tailors'].map((name, i) => ({ id: id('front'), name, districtId: districts[i % districts.length].id, owned: i === 0, cleanWeekly: 180 + i * 35, laundering: 600 + i * 160, suspicion: 10 + i * 4 })),
    rackets: [],
    rivals: [
      { id: 'valenti', name: 'Valenti Family', known: true, vendetta: 12, territory: ['dockside'], income: 'dock theft', intel: [] },
      { id: 'kovac', name: 'Kovac Outfit', known: true, vendetta: 6, territory: ['ironworks'], income: 'unions', intel: [] },
      { id: 'sable', name: 'Sable Crew', known: false, vendetta: 0, territory: ['uptown'], income: 'unknown', intel: [] },
    ],
    weekly: emptyWeekly(),
  };
  game.messages.push(message(game, 'Report', 'Welcome to the desk', 'Assign crew to time-based work, press Continue, and the calendar will stop when something needs the Don.', 'important'));
  return game;
}

function message(game: Game, type: Message['type'], title: string, body: string, importance: Importance, requiresResponse = false): Message {
  return { id: id('msg'), day: game.day, time: game.time, type, title, body, importance, requiresResponse, read: false };
}

function addMessage(game: Game, msg: Message) {
  game.messages.unshift(msg);
}

function districtName(game: Game, districtId?: string) {
  return game.districts.find((d) => d.id === districtId)?.name ?? 'The city';
}

function releaseCrew(game: Game, task: Task) {
  task.crewIds.forEach((crewId) => {
    const member = game.crew.find((c) => c.id === crewId);
    if (member && member.status === 'assigned' && member.taskId === task.id) {
      member.status = 'available';
      member.taskId = undefined;
    }
  });
}

function discover(game: Game, task: Task, types: Opportunity['type'][]) {
  const opp = game.opportunities.find((o) => !o.discovered && o.districtId === task.districtId && types.includes(o.type));
  if (!opp) return undefined;
  opp.discovered = true;
  opp.discoveryDay = game.day;
  opp.sourceTaskId = task.id;
  game.weekly.opps.push(opp.title);
  return opp;
}

function completeTask(game: Game, task: Task) {
  task.status = 'completed';
  task.unread = true;
  game.weekly.tasks.push(task.title);
  if (task.type === 'scout_racket') {
    const opp = discover(game, task, ['racket', 'contact', 'rival_weakness']);
    task.result = opp ? `Found ${opp.title}. ${opp.body} Value: ${opp.value}. Risk: ${opp.risk}.` : 'No strong racket lead surfaced.';
    addMessage(game, message(game, 'Opportunity', 'Scout report completed', task.result, 'important'));
  } else if (task.type === 'investigate_front') {
    const opp = discover(game, task, ['front', 'political_favor']);
    task.result = opp ? `Found ${opp.title}. ${opp.body} Capacity/value: ${opp.value}. Resistance: ${opp.risk}.` : 'No clean business looks ready to bend.';
    addMessage(game, message(game, 'Report', 'Front investigation completed', task.result, 'important'));
  } else if (task.type === 'pressure_owner') {
    const ok = Math.random() < 0.65;
    task.result = ok ? 'The owner accepted tribute. Dirty cash +$450. Reputation +2.' : 'The owner panicked and talked to patrolmen. Heat +5.';
    if (ok) { game.dirty += 450; game.rep += 2; } else { game.heat += 5; game.weekly.heat += 5; }
    addMessage(game, message(game, 'Report', 'Pressure report', task.result, 'important'));
  } else if (task.type === 'set_up_racket') {
    const opp = game.opportunities.find((o) => o.discovered && o.type === 'racket' && o.districtId === task.districtId);
    if (!opp || game.dirty < 1500) {
      task.status = 'failed';
      task.result = 'The setup lacked either cash or a discovered racket opportunity.';
      addMessage(game, message(game, 'Alert', 'Racket setup failed', task.result, 'important'));
    } else {
      game.dirty -= 1500;
      game.rackets.push({ id: id('racket'), name: opp.title, districtId: opp.districtId, min: 650, max: 1450, heat: 3, manpower: 2 });
      task.result = `${opp.title} is now active. Weekly dirty income has started.`;
      addMessage(game, message(game, 'Financial', 'Racket established', task.result, 'important'));
    }
  } else if (task.type === 'launder_money') {
    task.result = 'The books are cleaner. Laundering completed through a front.';
    addMessage(game, message(game, 'Financial', 'Laundering completed', task.result, 'normal'));
  } else if (task.type === 'bribe_official') {
    const reduction = roll(3, 8);
    game.heat = Math.max(0, game.heat - reduction);
    game.police = Math.max(0, game.police - Math.floor(reduction / 2));
    task.result = `The official took the envelope. Heat -${reduction}.`;
    addMessage(game, message(game, 'Police', 'Bribe resolved', task.result, 'important'));
  } else if (task.type === 'recruit_crew') {
    const name = ['Luca Ferri', 'Anita Vale', 'Paulie Knox', 'Mina Sharp'][roll(0, 3)];
    game.crew.push({ id: id('crew'), name, rank: 'associate', loyalty: roll(45, 75), violence: roll(30, 80), intelligence: roll(35, 80), charisma: roll(30, 75), stealth: roll(35, 80), greed: roll(20, 65), stress: 0, heat: 0, status: 'available', traits: ['recommended', 'ambitious'] });
    task.result = `Recruit found: ${name} joined as an associate.`;
    addMessage(game, message(game, 'Personal', 'Recruit available', task.result, 'important'));
  } else if (task.type === 'gather_intel') {
    const rival = game.rivals[roll(0, game.rivals.length - 1)];
    rival.known = true;
    rival.intel.push(`Weak collection route found near ${districtName(game, task.districtId)}.`);
    task.result = `Intel on ${rival.name}: a weak route and two names worth watching.`;
    addMessage(game, message(game, 'Rival', 'Rival intel', task.result, 'important'));
  } else if (task.type === 'sabotage_rival') {
    if (Math.random() < 0.7) {
      game.rep += 4;
      game.heat += 4;
      task.result = 'The rival operation stumbled. Reputation +4, Heat +4.';
    } else {
      game.heat += 8;
      const injured = game.crew.find((c) => c.id === task.crewIds[0]);
      if (injured) { injured.status = 'injured'; game.weekly.crew.push(`${injured.name} was injured during sabotage.`); }
      task.result = 'The job went loud. Heat +8 and one crew member was injured.';
    }
    addMessage(game, message(game, 'Threat', 'Sabotage report', task.result, 'critical'));
  } else if (task.type === 'lay_low') {
    const reduction = roll(5, 12);
    game.heat = Math.max(0, game.heat - reduction);
    game.police = Math.max(0, game.police - 2);
    task.result = `The family stayed quiet. Heat -${reduction}, police pressure -2.`;
    addMessage(game, message(game, 'Police', 'Lay low completed', task.result, 'important'));
  }
  releaseCrew(game, task);
  if (task.interrupts) game.stopReason = `Task completed: ${task.title}`;
}

function createTask(game: Game, type: TaskType, districtId?: string) {
  const needed = type === 'set_up_racket' || type === 'sabotage_rival' ? 2 : 1;
  const crew = game.crew.filter((c) => c.status === 'available').slice(0, needed);
  if (crew.length < needed) {
    addMessage(game, message(game, 'Alert', 'No crew available', 'Everyone useful is already busy, hurt, hiding, or unavailable.', 'important'));
    game.stopReason = 'No crew available';
    return;
  }
  const duration: Record<TaskType, number> = { scout_racket: roll(2, 5), investigate_front: roll(1, 4), pressure_owner: roll(2, 7), set_up_racket: roll(3, 10), launder_money: roll(1, 7), bribe_official: roll(1, 3), recruit_crew: roll(3, 14), gather_intel: roll(2, 6), sabotage_rival: roll(2, 5), lay_low: roll(3, 14) };
  const task: Task = { id: id('task'), title: taskNames[type], type, crewIds: crew.map((c) => c.id), districtId, startDay: game.day, endDay: game.day + duration[type], progress: 0, required: duration[type], status: 'active', risk: type === 'sabotage_rival' || type === 'pressure_owner' ? 'high' : 'medium', unread: false, interrupts: type !== 'launder_money', amountRemaining: type === 'launder_money' ? Math.min(1000, game.dirty) : undefined };
  game.tasks.push(task);
  crew.forEach((c) => { c.status = 'assigned'; c.taskId = task.id; });
}

function triggerEvent(game: Game) {
  const events: [Message['type'], string, string][] = [
    ['Police', 'Police captain requests a private meeting', 'A captain says there are ways to keep patrols looking elsewhere.'],
    ['Personal', 'A crew member is seen talking too much', 'A bartender heard one of yours bragging about collections.'],
    ['Rival', 'A rival family tests your territory', 'Strangers collected envelopes on a block that should answer to you.'],
    ['Opportunity', 'A business owner asks for protection', 'A shop owner wants a quiet arrangement before someone louder arrives.'],
    ['Police', 'A journalist investigates a front', 'Questions are being asked about cash flow at a respectable business.'],
    ['Report', 'A union contact offers leverage', 'A delegate can slow deliveries for anyone who disrespects you.'],
    ['Threat', 'A shipment disappears', 'A truck expected at dawn never made the turn.'],
    ['Police', 'A judge wants money', 'A friendly judge has become less friendly and more expensive.'],
    ['Personal', 'A recruit comes recommended by a dangerous friend', 'The candidate has talent, and baggage that may follow him in.'],
    ['Threat', 'A district becomes tense after too much pressure', 'People are closing shutters early. The streets are listening.'],
  ];
  const event = events[roll(0, events.length - 1)];
  const importance: Importance = event[0] === 'Threat' ? 'critical' : 'important';
  if (event[0] === 'Threat') game.heat += 2;
  game.stopReason = event[1];
  addMessage(game, message(game, event[0], event[1], event[2], importance, importance === 'critical'));
}

function weeklyReport(game: Game) {
  const list = (items: string[]) => items.length ? items.join(', ') : 'None';
  const w = game.weekly;
  const body = `New week, new decisions.\n\nClean income: $${w.clean}\nDirty income: $${w.dirty}\nLaundered: $${w.laundered}\nRacket profits: $${w.racketProfits}\nFront profits: $${w.frontProfits}\nHeat change: ${w.heat}\nPolice pressure change: ${w.police}\nCrew changes: ${list(w.crew)}\nRival moves: ${list(w.rivals)}\nOpportunities discovered: ${list(w.opps)}\nTasks completed: ${list(w.tasks)}\nNext week warnings: ${list(w.warnings)}`;
  addMessage(game, message(game, 'Weekly Summary', 'Weekly family report', body, 'important'));
  game.weekly = emptyWeekly();
  game.stopReason = 'Weekly report ready';
}

function processDay(game: Game) {
  game.heat = Math.max(0, game.heat - (game.rackets.length ? 0 : 1));
  game.police = Math.max(0, Math.min(100, game.police + (game.heat > 45 ? 1 : 0) - (game.heat < 12 ? 1 : 0)));
  game.tasks.filter((t) => t.status === 'active').forEach((task) => {
    const score = task.crewIds.reduce((sum, crewId) => {
      const c = game.crew.find((member) => member.id === crewId);
      return sum + (c ? c.intelligence + c.stealth + c.charisma : 0);
    }, 0);
    task.progress += score >= 210 ? 2 : 1;
    if (task.progress >= task.required) completeTask(game, task);
  });
  if (game.day > 0 && game.day % 7 === 0) {
    game.rackets.forEach((r) => {
      const income = roll(r.min, r.max);
      game.dirty += income;
      game.heat += r.heat;
      game.weekly.dirty += income;
      game.weekly.racketProfits += income;
      game.weekly.heat += r.heat;
    });
    game.fronts.filter((f) => f.owned).forEach((f) => {
      game.clean += f.cleanWeekly;
      game.weekly.clean += f.cleanWeekly;
      game.weekly.frontProfits += f.cleanWeekly;
    });
  }
  if (Math.random() < 0.12) triggerEvent(game);
  if (game.day > 0 && weekDay(game.day) === 'Monday') weeklyReport(game);
}

function processTimeStep(game: Game) {
  game.tasks.filter((t) => t.status === 'active' && t.type === 'launder_money').forEach((task) => {
    const chunk = Math.min(250, task.amountRemaining ?? 0, game.dirty);
    if (chunk > 0) {
      game.dirty -= chunk;
      const clean = Math.floor(chunk * 0.78);
      game.clean += clean;
      game.weekly.laundered += clean;
      task.amountRemaining = (task.amountRemaining ?? 0) - chunk;
    }
  });
}

function advance(game: Game): Game {
  const next = copy(game);
  const index = blocks.indexOf(next.time);
  if (index === blocks.length - 1) {
    next.day += 1;
    next.time = 'Morning';
    processDay(next);
  } else {
    next.time = blocks[index + 1];
    processTimeStep(next);
  }
  const unread = next.messages.find((m) => !m.read && (m.importance === 'important' || m.importance === 'critical'));
  if (next.stopReason || unread) {
    next.simulating = false;
    next.stopReason = next.stopReason || `${unread?.type}: ${unread?.title}`;
  }
  return next;
}

export default function App() {
  const [game, setGame] = useState<Game>(() => initialGame());
  const [tab, setTab] = useState<Tab>('Dashboard');
  const [districtId, setDistrictId] = useState('dockside');
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [selectedParcelId, setSelectedParcelId] = useState('');
  const district = game.districts.find((d) => d.id === districtId) ?? game.districts[0];
  const districtLayout = useMemo(() => makeDistrictLayout(district), [district]);
  const selectedBlock = districtLayout.blocks.find((block) => block.id === selectedBlockId) ?? districtLayout.blocks[0];
  const selectedParcel = selectedBlock?.parcels.find((parcel) => parcel.id === selectedParcelId) ?? selectedBlock?.parcels[0];
  const activeTasks = game.tasks.filter((t) => t.status === 'active');
  const knownOpps = game.opportunities.filter((o) => o.discovered);
  const important = game.messages.filter((m) => !m.read && (m.importance === 'important' || m.importance === 'critical'));
  const nextStops = useMemo(() => activeTasks.slice().sort((a, b) => a.endDay - b.endDay).slice(0, 6), [activeTasks]);

  useEffect(() => {
    if (!game.simulating) return;
    const timer = window.setInterval(() => setGame(advance), 420);
    return () => window.clearInterval(timer);
  }, [game.simulating]);

  function mutate(fn: (draft: Game) => void) {
    setGame((current) => {
      const draft = copy(current);
      fn(draft);
      return draft;
    });
  }

  function order(type: TaskType, targetDistrict = district.id) {
    mutate((draft) => createTask(draft, type, targetDistrict));
    setTab('Tasks');
  }

  function selectDistrict(nextId: string) {
    setDistrictId(nextId);
    setSelectedBlockId('');
    setSelectedParcelId('');
    setTab('District');
  }

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand"><strong>Desk Don</strong><span>{game.family}</span></div>
        {tabs.map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}
      </aside>
      <main className="main">
        <header className="top">
          <div><small>{weekDay(game.day)}</small><h1>{dateLabel(game.day)} - {game.time}</h1></div>
          <div className="top-actions">
            <button onClick={() => mutate((d) => { d.simulating = false; d.stopReason = 'Paused manually'; })}>Pause</button>
            <button className="primary" disabled={game.simulating} onClick={() => mutate((d) => { d.messages.forEach((m) => { if (m.importance !== 'critical') m.read = true; }); d.simulating = true; d.stopReason = ''; })}>Continue</button>
            <button onClick={() => localStorage.setItem(saveKey, JSON.stringify(game))}>Save</button>
            <button onClick={() => { const raw = localStorage.getItem(saveKey); if (raw) setGame(JSON.parse(raw) as Game); }}>Load</button>
            <button onClick={() => setGame(initialGame())}>New</button>
          </div>
        </header>
        {game.stopReason && <div className="stop"><strong>Simulation stopped:</strong> {game.stopReason}</div>}
        {tab === 'Dashboard' && <>
          <CityMap game={game} selectedId={district.id} onSelect={selectDistrict} />
          <div className="grid">
          <Stat label="Dirty Cash" value={`$${game.dirty.toLocaleString()}`} />
          <Stat label="Clean Cash" value={`$${game.clean.toLocaleString()}`} />
          <Stat label="Heat" value={game.heat} />
          <Stat label="Police" value={game.police} />
          <Panel title="Active Work"><List empty="No crews assigned." items={activeTasks.map((t) => `${t.title} - ${t.progress}/${t.required} - ${districtName(game, t.districtId)}`)} /></Panel>
          <Panel title="Important Inbox"><List empty="No urgent reports." items={important.map((m) => `${m.type}: ${m.title}`)} /></Panel>
          <Panel title="Next Stops"><List empty="No scheduled completions." items={nextStops.map((t) => `${dateLabel(t.endDay)} - ${t.title}`)} /></Panel>
          </div>
        </>}
        {tab === 'Calendar' && <Panel title="Calendar"><div className="calendar">{Array.from({ length: 21 }, (_, i) => game.day + i).map((day) => <div key={day}><b>{dateLabel(day)}</b><span>{game.tasks.filter((t) => t.status === 'active' && t.endDay === day).map((t) => t.title).join(', ') || 'No scheduled stops'}</span></div>)}</div></Panel>}
        {tab === 'Inbox' && <Panel title="Inbox">{game.messages.map((m) => <button key={m.id} className={`message ${m.read ? 'read' : m.importance}`} onClick={() => mutate((d) => { const msg = d.messages.find((x) => x.id === m.id); if (msg) msg.read = true; })}><b>{m.title}</b><span>{dateLabel(m.day)} - {m.time} - {m.type}</span><p>{m.body}</p></button>)}</Panel>}
        {tab === 'City' && <>
          <CityMap game={game} selectedId={district.id} onSelect={selectDistrict} />
          <div className="districts">{game.districts.map((d) => <button key={d.id} onClick={() => selectDistrict(d.id)}><h3>{d.name}</h3><span>{mapDistricts[d.id]?.island ?? 'City'} - Wealth {d.wealth} - Police {d.police}</span><span>Fear {d.fear} - Control {d.control} - Rival {d.rival}</span></button>)}</div>
        </>}
        {tab === 'District' && <DistrictControl
          district={district}
          layout={districtLayout}
          selectedBlock={selectedBlock}
          selectedParcel={selectedParcel}
          onSelectBlock={(blockId) => { setSelectedBlockId(blockId); setSelectedParcelId(''); }}
          onSelectParcel={(blockId, parcelId) => { setSelectedBlockId(blockId); setSelectedParcelId(parcelId); }}
          onOrder={order}
          leads={knownOpps.filter((o) => o.districtId === district.id).map((o) => `${o.title} - ${o.type} - ${o.value} - ${o.risk}`)}
        />}
        {tab === 'Crew' && <Panel title="Crew"><Rows items={game.crew.map((c) => [`${c.name} (${c.rank})`, `${c.status}${c.taskId ? ` - ${game.tasks.find((t) => t.id === c.taskId)?.title}` : ''}`, `Loy ${c.loyalty} - Vio ${c.violence} - Int ${c.intelligence} - Cha ${c.charisma} - Stl ${c.stealth} - ${c.traits.join(', ')}`])} /></Panel>}
        {tab === 'Tasks' && <Panel title="Tasks"><Rows items={game.tasks.map((t) => [t.title, `${t.status} - ${t.progress}/${t.required} - ${districtName(game, t.districtId)} - due ${dateLabel(t.endDay)}`, t.result || 'A report will arrive when the work is done.'])} /></Panel>}
        {tab === 'Opportunities' && <Panel title="Known Opportunities"><List empty="Scout districts and investigate fronts to reveal opportunities." items={knownOpps.map((o) => `${o.title} - ${o.type} - ${districtName(game, o.districtId)} - ${o.value} - ${o.risk}`)} /></Panel>}
        {tab === 'Fronts' && <Panel title="Fronts"><button className="primary inline" onClick={() => order('launder_money')}>Launder $1,000 Through Front</button><Rows items={game.fronts.map((f) => [f.name, `${f.owned ? 'Owned' : 'Unowned'} - ${districtName(game, f.districtId)}`, `Clean $${f.cleanWeekly}/wk - Capacity $${f.laundering} - Suspicion ${f.suspicion}`])} /></Panel>}
        {tab === 'Rackets' && <Panel title="Rackets"><List empty="No active rackets yet. Discover an opportunity, then set it up." items={game.rackets.map((r) => `${r.name} - ${districtName(game, r.districtId)} - $${r.min}-$${r.max}/wk - Heat +${r.heat}`)} /></Panel>}
        {tab === 'Rivals' && <Panel title="Rivals"><Rows items={game.rivals.map((r) => [r.name, `${r.known ? 'Known' : 'Unknown'} - Vendetta ${r.vendetta} - Income ${r.income}`, r.intel.join(', ') || 'No detailed intel yet.'])} /></Panel>}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="stat"><small>{label}</small><strong>{value}</strong></div>;
}

function CityMap({ game, selectedId, onSelect }: { game: Game; selectedId: string; onSelect: (districtId: string) => void }) {
  return (
    <section className="control-hub">
      <div className="hub-header">
        <div>
          <small>Main control hub</small>
          <h2>New Bordeaux Bay</h2>
        </div>
        <div className="map-legend">
          <span><i className="legend-control" /> Player control</span>
          <span><i className="legend-rival" /> Rival pressure</span>
          <span><i className="legend-heat" /> Police heat</span>
        </div>
      </div>
      <div className="map-wrap">
        <svg className="city-map" viewBox="0 0 1120 820" role="img" aria-label="City map with four islands and clickable district subdivisions">
          <defs>
            <pattern id="waterGrid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            </pattern>
            <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>
          <rect width="1120" height="820" fill="#85898c" />
          <rect width="1120" height="820" fill="url(#waterGrid)" />
          <g className="island-masses">
            {islandMasses.map((path) => <path key={path} d={path} />)}
          </g>
          {game.districts.map((district) => {
            const shape = mapDistricts[district.id];
            if (!shape) return null;
            return (
              <g key={district.id} className={`map-district ${district.id === selectedId ? 'selected' : ''}`}>
                <polygon
                  points={shape.points}
                  onClick={() => onSelect(district.id)}
                />
              </g>
            );
          })}
          <g className="bridges">
            {mapBridges.map((path) => <path key={path} d={path} />)}
          </g>
          {game.districts.map((district) => {
            const shape = mapDistricts[district.id];
            if (!shape) return null;
            return (
              <g key={`${district.id}-label`} className="map-label">
                <rect x={shape.cx - 54} y={shape.cy - 23} width="108" height="32" rx="4" />
                <text x={shape.cx} y={shape.cy - 4}>{shape.label}</text>
              </g>
            );
          })}
        </svg>
        <aside className="map-dossier">
          <small>Selected district</small>
          <h3>{districtName(game, selectedId)}</h3>
          {(() => {
            const district = game.districts.find((item) => item.id === selectedId);
            if (!district) return null;
            return (
              <>
                <p>{mapDistricts[selectedId]?.island ?? 'City'} district dossier. Click any subdivision to open its orders.</p>
                <div className="mini-stats">
                  <span>Size <b>{districtMapArea(district.id)}</b></span>
                  <span>Wealth <b>{district.wealth}</b></span>
                  <span>Police <b>{district.police}</b></span>
                  <span>Control <b>{district.control}</b></span>
                  <span>Rival <b>{district.rival}</b></span>
                </div>
              </>
            );
          })()}
        </aside>
      </div>
    </section>
  );
}

function DistrictControl({
  district,
  layout,
  selectedBlock,
  selectedParcel,
  onSelectBlock,
  onSelectParcel,
  onOrder,
  leads,
}: {
  district: District;
  layout: DistrictLayout;
  selectedBlock?: Block;
  selectedParcel?: Parcel;
  onSelectBlock: (blockId: string) => void;
  onSelectParcel: (blockId: string, parcelId: string) => void;
  onOrder: (type: TaskType, districtId?: string) => void;
  leads: string[];
}) {
  const blocks = layout.blocks;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number; pan: Point } | undefined>();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const selectedBlockArea = selectedBlock ? Math.round(polygonArea(selectedBlock.polygon)) : 0;
  const selectedParcelArea = selectedParcel ? Math.round(polygonArea(selectedParcel.polygon)) : 0;
  const selectedBlockCenter = selectedBlock ? polygonCentroid(selectedBlock.polygon) : undefined;
  const clipId = `district-clip-${district.id}`;
  const viewWidth = 800 / zoom;
  const viewHeight = 560 / zoom;
  const maxPanX = Math.max(0, (800 - viewWidth) / 2);
  const maxPanY = Math.max(0, (560 - viewHeight) / 2);
  const viewBox = `${400 - viewWidth / 2 + pan.x} ${280 - viewHeight / 2 + pan.y} ${viewWidth} ${viewHeight}`;
  const movePan = (dx: number, dy: number) => setPan((current) => ({
    x: Math.max(-maxPanX, Math.min(maxPanX, current.x + dx)),
    y: Math.max(-maxPanY, Math.min(maxPanY, current.y + dy)),
  }));
  const clampPan = (point: Point, nextZoom = zoom) => {
    const nextViewWidth = 800 / nextZoom;
    const nextViewHeight = 560 / nextZoom;
    const nextMaxPanX = Math.max(0, (800 - nextViewWidth) / 2);
    const nextMaxPanY = Math.max(0, (560 - nextViewHeight) / 2);
    return {
      x: Math.max(-nextMaxPanX, Math.min(nextMaxPanX, point.x)),
      y: Math.max(-nextMaxPanY, Math.min(nextMaxPanY, point.y)),
    };
  };
  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const ratioX = (event.clientX - rect.left) / rect.width;
    const ratioY = (event.clientY - rect.top) / rect.height;
    const currentMinX = 400 - viewWidth / 2 + pan.x;
    const currentMinY = 280 - viewHeight / 2 + pan.y;
    const mouseWorldX = currentMinX + ratioX * viewWidth;
    const mouseWorldY = currentMinY + ratioY * viewHeight;
    const nextZoom = Math.max(1, Math.min(3, zoom + (event.deltaY < 0 ? 0.18 : -0.18)));
    const nextViewWidth = 800 / nextZoom;
    const nextViewHeight = 560 / nextZoom;
    const nextPan = clampPan({
      x: mouseWorldX - ratioX * nextViewWidth + nextViewWidth / 2 - 400,
      y: mouseWorldY - ratioY * nextViewHeight + nextViewHeight / 2 - 280,
    }, nextZoom);
    setZoom(nextZoom);
    setPan(nextPan);
  };
  const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    if (!drag || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = (event.clientX - drag.x) / rect.width * viewWidth;
    const dy = (event.clientY - drag.y) / rect.height * viewHeight;
    setPan(clampPan({ x: drag.pan.x - dx, y: drag.pan.y - dy }));
  };

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setDrag(undefined);
  }, [district.id]);

  return (
    <section className="district-control">
      <div className="district-head">
        <div>
          <small>District control</small>
          <h2>{district.name}</h2>
        </div>
        <p>Size {districtMapArea(district.id)} - Wealth {district.wealth} - Police {district.police} - Corruption {district.corruption} - Fear {district.fear} - Public order {district.order}</p>
      </div>
      <div className="district-layout">
        <div className="block-map-panel">
          <div className="map-tools">
            <button onClick={() => setZoom((value) => Math.max(1, value - 0.25))}>-</button>
            <button onClick={() => setZoom((value) => Math.min(2.25, value + 0.25))}>+</button>
            <button onClick={() => movePan(0, -42)}>N</button>
            <button onClick={() => movePan(-42, 0)}>W</button>
            <button onClick={() => movePan(42, 0)}>E</button>
            <button onClick={() => movePan(0, 42)}>S</button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset</button>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <svg
            ref={svgRef}
            className={`block-map ${drag ? 'dragging' : ''}`}
            viewBox={viewBox}
            role="img"
            aria-label={`${district.name} block and parcel map`}
            onWheel={handleWheel}
            onMouseDown={(event) => setDrag({ x: event.clientX, y: event.clientY, pan })}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDrag(undefined)}
            onMouseLeave={() => setDrag(undefined)}
          >
            <defs>
              <clipPath id={clipId}>
                <path d={renderPolygonPath(layout.outerPolygon)} />
              </clipPath>
            </defs>
            <rect width="800" height="560" className="district-watermark" />
            <path className="district-outer" d={renderPolygonPath(layout.outerPolygon)} />
            {blocks.map((block) => (
              <g key={block.id} className={`district-block ${selectedBlock?.id === block.id ? 'selected' : ''}`}>
                <path d={renderPolygonPath(block.polygon)} onClick={() => onSelectBlock(block.id)} />
                {block.parcels.map((parcel) => (
                  <g key={parcel.id} className={`parcel ${selectedParcel?.id === parcel.id ? 'selected' : ''} owner-${parcel.occupiedBy}`}>
                    <path data-size={parcel.size} d={renderPolygonPath(parcel.polygon)} onClick={(event) => { event.stopPropagation(); onSelectParcel(block.id, parcel.id); }} />
                  </g>
                ))}
              </g>
            ))}
            <g className="district-roads" clipPath={`url(#${clipId})`}>
              {layout.roads.map((road) => <path key={road.id} className={road.kind} d={road.path} strokeWidth={road.width} />)}
            </g>
            {selectedBlockCenter && <text className="selected-block-label" x={selectedBlockCenter.x} y={selectedBlockCenter.y}>{selectedBlock?.label}</text>}
            <g className="district-landmarks">
              {layout.landmarks.map((landmark) => (
                <g key={landmark.id} transform={`translate(${landmark.point.x} ${landmark.point.y})`}>
                  <circle r="5" />
                  <text x="9" y="4">{landmark.label}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>
        <aside className="district-dossier">
          <section>
            <small>Selected block</small>
            <h3>{selectedBlock?.label ?? 'No block selected'}</h3>
            {selectedBlock && <p>Pressure {selectedBlock.pressure}. Area {selectedBlockArea}. Parcels {selectedBlock.parcels.length}. Use block orders when you want the crew to work a whole street area.</p>}
            <div className="actions compact">
              <button onClick={() => onOrder('scout_racket', district.id)}>Scout Block</button>
              <button onClick={() => onOrder('pressure_owner', district.id)}>Pressure Block</button>
              <button onClick={() => onOrder('lay_low', district.id)}>Cool Block</button>
            </div>
          </section>
          <section>
            <small>Selected parcel</small>
            <h3>{selectedParcel ? selectedParcel.label : 'No parcel selected'}</h3>
            {selectedParcel && (
              <p>{selectedParcel.kind} - {selectedParcel.occupiedBy}. Size {selectedParcel.size}. Area {selectedParcelArea}. Value {selectedParcel.value}. Heat {selectedParcel.heat}. Parcel orders are for specific buildings, owners, or lots.</p>
            )}
            <div className="actions compact">
              <button onClick={() => onOrder('investigate_front', district.id)}>Investigate Parcel</button>
              <button onClick={() => onOrder('set_up_racket', district.id)}>Set Up Racket</button>
              <button onClick={() => onOrder('bribe_official', district.id)}>Handle Heat</button>
            </div>
          </section>
          <section>
            <small>Known local leads</small>
            <List empty="No known leads in this district yet." items={leads} />
          </section>
        </aside>
      </div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="panel"><h2>{title}</h2>{children}</section>;
}

function List({ items, empty }: { items: string[]; empty: string }) {
  return items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">{empty}</p>;
}

function Rows({ items }: { items: string[][] }) {
  return <div className="rows">{items.length ? items.map((row) => <div key={row.join('|')}><b>{row[0]}</b><span>{row[1]}</span><p>{row[2]}</p></div>) : <p className="muted">None</p>}</div>;
}
