import { DestinyActivityModeType, DestinyClass } from "bungie-net-core/enums";
import { ComponentPropsWithoutRef, JSX } from "react";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const newRaidHashes = [2192826039, 1541433876, 4129614942];
export const newDungeonHashes = [300092127, 1915770060, 3492566689, 4293676253];

export const destinyClassName: { [key: number]: string } = {
  [DestinyClass.Titan]: "Titan",
  [DestinyClass.Hunter]: "Hunter",
  [DestinyClass.Warlock]: "Warlock",
  [DestinyClass.Unknown]: "Unknown",
};

export const activityModeNames: { [key: number]: string } = {
  [DestinyActivityModeType.None]: "None",
  [DestinyActivityModeType.Story]: "Stories",
  [DestinyActivityModeType.Strike]: "Strikes",
  [DestinyActivityModeType.Raid]: "Raids",
  [DestinyActivityModeType.AllPvP]: "All PvP",
  [DestinyActivityModeType.Patrol]: "Patrol",
  [DestinyActivityModeType.AllPvE]: "All PvE",
  [DestinyActivityModeType.Control]: "Control",
  [DestinyActivityModeType.Clash]: "Clash",
  [DestinyActivityModeType.CrimsonDoubles]: "Crimson Doubles",
  [DestinyActivityModeType.Nightfall]: "Nightfall",
  [DestinyActivityModeType.HeroicNightfall]: "Heroic Nightfall",
  [DestinyActivityModeType.AllStrikes]: "All Strikes",
  [DestinyActivityModeType.IronBanner]: "Iron Banner",
  [DestinyActivityModeType.AllMayhem]: "All Mayhem",
  [DestinyActivityModeType.Supremacy]: "Supremacy",
  [DestinyActivityModeType.PrivateMatchesAll]: "Private Matches All",
  [DestinyActivityModeType.Survival]: "Survival",
  [DestinyActivityModeType.Countdown]: "Countdown",
  [DestinyActivityModeType.TrialsOfTheNine]: "Trials of the Nine",
  [DestinyActivityModeType.Social]: "Social",
  [DestinyActivityModeType.TrialsCountdown]: "Trials Countdown",
  [DestinyActivityModeType.TrialsSurvival]: "Trials Survival",
  [DestinyActivityModeType.IronBannerControl]: "Iron Banner Control",
  [DestinyActivityModeType.IronBannerClash]: "Iron Banner Clash",
  [DestinyActivityModeType.IronBannerSupremacy]: "Iron Banner Supremacy",
  [DestinyActivityModeType.ScoredNightfall]: "Nightfalls",
  [DestinyActivityModeType.ScoredHeroicNightfall]: "Scored Heroic Nightfall",
  [DestinyActivityModeType.Rumble]: "Rumble",
  [DestinyActivityModeType.AllDoubles]: "All Doubles",
  [DestinyActivityModeType.Doubles]: "Doubles",
  [DestinyActivityModeType.PrivateMatchesClash]: "Private Matches Clash",
  [DestinyActivityModeType.PrivateMatchesControl]: "Private Matches Control",
  [DestinyActivityModeType.PrivateMatchesSupremacy]:
    "Private Matches Supremacy",
  [DestinyActivityModeType.PrivateMatchesCountdown]:
    "Private Matches Countdown",
  [DestinyActivityModeType.PrivateMatchesSurvival]: "Private Matches Survival",
  [DestinyActivityModeType.PrivateMatchesMayhem]: "Private Matches Mayhem",
  [DestinyActivityModeType.PrivateMatchesRumble]: "Private Matches Rumble",
  [DestinyActivityModeType.HeroicAdventure]: "Heroic Adventure",
  [DestinyActivityModeType.Showdown]: "Showdown",
  [DestinyActivityModeType.Lockdown]: "Lockdown",
  [DestinyActivityModeType.Scorched]: "Scorched",
  [DestinyActivityModeType.ScorchedTeam]: "Scorched Team",
  [DestinyActivityModeType.Gambit]: "Gambit",
  [DestinyActivityModeType.AllPvECompetitive]: "All PvE Competitive",
  [DestinyActivityModeType.Breakthrough]: "Breakthrough",
  [DestinyActivityModeType.BlackArmoryRun]: "Black Armory Run",
  [DestinyActivityModeType.Salvage]: "Salvage",
  [DestinyActivityModeType.IronBannerSalvage]: "Iron Banner Salvage",
  [DestinyActivityModeType.PvPCompetitive]: "PvP Competitive",
  [DestinyActivityModeType.PvPQuickplay]: "PvP Quickplay",
  [DestinyActivityModeType.ClashQuickplay]: "Clash Quickplay",
  [DestinyActivityModeType.ClashCompetitive]: "Clash Competitive",
  [DestinyActivityModeType.ControlQuickplay]: "Control Quickplay",
  [DestinyActivityModeType.ControlCompetitive]: "Control Competitive",
  [DestinyActivityModeType.GambitPrime]: "Gambit Prime",
  [DestinyActivityModeType.Reckoning]: "Reckoning",
  [DestinyActivityModeType.Menagerie]: "Menagerie",
  [DestinyActivityModeType.VexOffensive]: "Vex Offensive",
  [DestinyActivityModeType.NightmareHunt]: "Nightmare Hunt",
  [DestinyActivityModeType.Elimination]: "Elimination",
  [DestinyActivityModeType.Momentum]: "Momentum",
  [DestinyActivityModeType.Dungeon]: "Dungeons",
  [DestinyActivityModeType.Sundial]: "Sundials",
  [DestinyActivityModeType.TrialsOfOsiris]: "Trials of Osiris",
  [DestinyActivityModeType.Dares]: "Dares",
  [DestinyActivityModeType.Offensive]: "Offensives",
  [DestinyActivityModeType.LostSector]: "Lost Sectors",
  [DestinyActivityModeType.Rift]: "Rift",
  [DestinyActivityModeType.ZoneControl]: "Zone Control",
  [DestinyActivityModeType.IronBannerRift]: "Iron Banner Rift",
  [DestinyActivityModeType.IronBannerZoneControl]: "Iron Banner Zone Control",
  [DestinyActivityModeType.Relic]: "Relic",
};

const revenant = new Date("2024-10-08T17:00:00.000Z");
const echoes = new Date("2024-06-04T17:00:00.000Z");

export const getSeason = (period: Date) => {
  if (period > revenant) return "Episode: Revenant";
  if (period > echoes) return "Episode: Echoes";
  return "Season of the Wish";
};

const msInYear = 366 * 24 * 3600_000;
export const seasonWeights = {
  "Episode: Revenant":
    (new Date("2024-12-31T23:59:59.999Z").getTime() - revenant.getTime()) /
    msInYear,
  "Episode: Echoes": (revenant.getTime() - echoes.getTime()) / msInYear,
  "Season of the Wish":
    (echoes.getTime() - new Date("2024-01-01T00:00:00.000Z").getTime()) /
    msInYear,
};

type ClassSvgProps = ComponentPropsWithoutRef<"svg">;

const Hunter = (props: ClassSvgProps) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m11.297 12.239 4.703-.016-4.705 7.078 4.705-.016-5.02 7.551h-4.77l4.764-7.062h-4.764l4.762-7.059h-4.762l5.083-7.534 4.707-.017zm9.406 0-4.703-7.075 4.707.017 5.083 7.534h-4.762l4.762 7.059h-4.764l4.764 7.062h-4.77l-5.02-7.551 4.705.016-4.705-7.078z" />
  </svg>
);

const Titan = (props: ClassSvgProps) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m15.214 15.986-8.925-5.153v10.306zm1.572 0 8.925 5.153v-10.306zm8.109-5.629-8.856-5.193-8.896 5.17 8.896 5.136zm-.023 11.274-8.833-5.101-8.873 5.123 8.873 5.183z" />
  </svg>
);

const Warlock = (props: ClassSvgProps) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m5.442 23.986 7.255-11.65-2.71-4.322-9.987 15.972zm5.986 0 4.28-6.849-2.717-4.333-6.992 11.182zm7.83-11.611 7.316 11.611h5.426l-10.015-15.972zm-7.26 11.611h8.004l-4.008-6.392zm6.991-11.182-2.703 4.324 4.302 6.858h5.413zm-5.707-.459 2.71-4.331 2.71 4.331-2.703 4.326z" />
  </svg>
);
export const destinyClassSvg: {
  [key: number]: (props: ClassSvgProps) => JSX.Element;
} = {
  [DestinyClass.Titan]: Titan,
  [DestinyClass.Hunter]: Hunter,
  [DestinyClass.Warlock]: Warlock,
};
