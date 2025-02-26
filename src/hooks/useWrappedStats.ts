import {
  DestinyActivityModeType,
  DestinyClass,
  DestinyHistoricalStatsPeriodGroup,
} from "bungie-net-core/models";
import { useMemo } from "react";
import {
  activityModeNames,
  getSeason,
  newDungeonHashes,
  newRaidHashes,
  seasonWeights,
} from "@/lib/maps";

/**
 * This calculates a bunch of stats based on the activities the user has played.
 *
 * yes, it's a lot of code, but it's all just grouping and counting so it makes
 * sense to keep it all together for some minor performance gains.
 */
export const useWrappedStats = (
  activities: (DestinyHistoricalStatsPeriodGroup & {
    characterId: string;
  })[],
  characterMap: Record<string, DestinyClass>
) =>
  useMemo(() => {
    const groupedByMode = new Map<
      DestinyActivityModeType,
      DestinyHistoricalStatsPeriodGroup[]
    >();
    const groupedByPrimaryMode = new Map<
      DestinyActivityModeType,
      DestinyHistoricalStatsPeriodGroup[]
    >();
    const groupedByMonth = new Map<
      number,
      DestinyHistoricalStatsPeriodGroup[]
    >();
    const groupedByHash = new Map<
      number,
      DestinyHistoricalStatsPeriodGroup[]
    >();
    const groupedByClass = new Map<
      DestinyClass,
      DestinyHistoricalStatsPeriodGroup[]
    >();
    const groupedBySeason = new Map<
      keyof typeof seasonWeights,
      DestinyHistoricalStatsPeriodGroup[]
    >();

    const totalStats = {
      playTime: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      count: activities.length,
    };

    const longestStreak = {
      numDays: 0,
      activityCount: 0,
      start: null as Date | null,
      end: null as Date | null,
      currentDays: 0,
      currentActivityCount: 0,
      currentStart: null as Date | null,
      currentEnd: null as Date | null,
    };

    const newRaidActivities: DestinyHistoricalStatsPeriodGroup[] = [];
    const newDungeonActivities: DestinyHistoricalStatsPeriodGroup[] = [];

    const gambitGames: DestinyHistoricalStatsPeriodGroup[] = [];
    const pvpGames: DestinyHistoricalStatsPeriodGroup[] = [];

    activities.forEach((activity) => {
      // total stats
      const timePlayedSeconds =
        activity.values["timePlayedSeconds"]?.basic.value ?? 0;
      totalStats.playTime += timePlayedSeconds;
      totalStats.kills += activity.values["kills"]?.basic.value ?? 0;
      totalStats.deaths += activity.values["deaths"]?.basic.value ?? 0;
      totalStats.assists += activity.values["assists"]?.basic.value ?? 0;

      // Group by mode
      activity.activityDetails.modes.forEach((mode) => {
        const existing = groupedByMode.get(mode);
        if (!existing) {
          groupedByMode.set(mode, [activity]);
        } else {
          groupedByMode.get(mode)!.push(activity);
        }
      });

      // Group by primary mode
      const mode = activity.activityDetails.mode;
      const existingModeGroup = groupedByPrimaryMode.get(mode);
      if (!existingModeGroup) {
        groupedByPrimaryMode.set(mode, [activity]);
      } else {
        groupedByPrimaryMode.get(mode)!.push(activity);
      }

      // Group by month
      const month = new Date(activity.period).getMonth();
      const existingMonthGroup = groupedByMonth.get(month);
      if (!existingMonthGroup) {
        groupedByMonth.set(month, [activity]);
      } else {
        groupedByMonth.get(month)!.push(activity);
      }

      // Group by hash
      const hash = activity.activityDetails.directorActivityHash;
      const existingHashGroup = groupedByHash.get(hash);
      if (!existingHashGroup) {
        groupedByHash.set(hash, [activity]);
      } else {
        groupedByHash.get(hash)!.push(activity);
      }

      // Group by class
      const characterClass = characterMap[activity.characterId] ?? 3;
      const existingClassGroup = groupedByClass.get(characterClass);
      if (!existingClassGroup) {
        groupedByClass.set(characterClass, [activity]);
      } else {
        groupedByClass.get(characterClass)!.push(activity);
      }

      // Group by season
      const season = getSeason(new Date(activity.period));
      const existingSeasonGroup = groupedBySeason.get(season);
      if (!existingSeasonGroup) {
        groupedBySeason.set(season, [activity]);
      } else {
        groupedBySeason.get(season)!.push(activity);
      }

      // new raid/dungeon activities
      if (newRaidHashes.includes(hash)) {
        newRaidActivities.push(activity);
      } else if (newDungeonHashes.includes(hash)) {
        newDungeonActivities.push(activity);
      }

      // gambit games
      if (mode === 63) {
        gambitGames.push(activity);
      }

      if (activity.activityDetails.modes.includes(5)) {
        pvpGames.push(activity);
      }

      // longest streak
      if (timePlayedSeconds > 0) {
        const date = new Date(activity.period);
        date.setUTCHours(17, 0, 0, 0);

        if (!longestStreak.start) {
          longestStreak.numDays = 1;
          longestStreak.activityCount = 1;
          longestStreak.start = date;
          longestStreak.end = date;

          longestStreak.currentDays = 1;
          longestStreak.currentActivityCount = 1;
          longestStreak.currentStart = date;
          longestStreak.currentEnd = date;
        } else {
          if (longestStreak.currentStart!.getTime() === date.getTime()) {
            longestStreak.currentActivityCount++;
          } else if (
            longestStreak.currentStart!.getTime() ===
            date.getTime() + 86_400_000
          ) {
            longestStreak.currentActivityCount++;
            longestStreak.currentDays++;
            longestStreak.currentStart = date;
          } else {
            longestStreak.currentDays = 1;
            longestStreak.currentActivityCount = 1;
            longestStreak.currentStart = date;
            longestStreak.currentEnd = date;
          }

          if (longestStreak.currentDays > longestStreak.numDays) {
            longestStreak.numDays = longestStreak.currentDays;
            longestStreak.activityCount = longestStreak.currentActivityCount;
            longestStreak.start = longestStreak.currentStart;
            longestStreak.end = longestStreak.currentEnd;
          }
        }
      }
    });

    const sortedByTimeInMode = Array.from(groupedByPrimaryMode.entries())
      .sort(
        ([, a], [, b]) =>
          b.reduce(
            (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
            0
          ) -
          a.reduce(
            (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
            0
          )
      )
      .map(([mode, activities]) => ({
        mode,
        count: activities.length,
        timePlayedSeconds: activities.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        ),
        modeName: activityModeNames[mode],
      }));

    const hashedActs = Array.from(groupedByHash.entries()).map(
      ([hash, activities]) => ({
        hash,
        count: activities.length,
        timePlayedSeconds: activities.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        ),
      })
    );

    const sortedByTimeInHash = hashedActs.sort(
      (a, b) => b.timePlayedSeconds - a.timePlayedSeconds
    );

    const topNModes = (n: number) => sortedByTimeInMode.slice(0, n);

    const topNActivitiesByPlaytime = (n: number) =>
      sortedByTimeInHash.slice(0, n);

    const [mostPopularMonthId, mostPopularMonthEntries] = Array.from(
      groupedByMonth.entries()
    ).sort(
      ([, a], [, b]) =>
        b.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        ) -
        a.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        )
    )[0] ?? [11, []];

    const sortedClassEntries = Array.from(groupedByClass.entries())
      .map(([classType, activities]) => {
        const timePlayedSeconds = activities.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        );
        return [
          classType,
          {
            count: activities.length,
            timePlayedSeconds,
            percentTimePlayed: (100 * timePlayedSeconds) / totalStats.playTime,
          },
        ] as const;
      })
      .sort(([, a], [, b]) => b.timePlayedSeconds - a.timePlayedSeconds);

    const [leastPopularSeasonName, leastPopularSeasonActs] = Array.from(
      groupedBySeason.entries()
    ).sort(
      ([aName, a], [bName, b]) =>
        a.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        ) *
          seasonWeights[aName] -
        b.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        ) *
          seasonWeights[bName]
    )[0];

    const monthlyPlayTimeByDay = new Array(32).fill(0);
    mostPopularMonthEntries.forEach((entry) => {
      monthlyPlayTimeByDay[new Date(entry.period).getDate()] +=
        entry.values["timePlayedSeconds"]?.basic.value ?? 0;
    });

    return {
      mostPopularMonth: {
        id: mostPopularMonthId,
        count: mostPopularMonthEntries.length,
        timePlayedSeconds: mostPopularMonthEntries.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        ),
        playtimeByDay: monthlyPlayTimeByDay,
      },
      leastPopularSeason: {
        name: leastPopularSeasonName,
        count: leastPopularSeasonActs.length,
        timePlayedSeconds: leastPopularSeasonActs.reduce(
          (acc, e) => acc + (e.values["timePlayedSeconds"]?.basic.value ?? 0),
          0
        ),
      },
      topNModes,
      topNActivitiesByPlaytime,
      totalStats,
      longestStreak: {
        numDays: longestStreak.numDays,
        activityCount: longestStreak.activityCount,
        start: longestStreak.start!,
        end: longestStreak.end!,
      },
      sortedClassEntries,
      newDungeonActivities: {
        count: newDungeonActivities.length,
        completed: newDungeonActivities.filter(
          (a) =>
            a.values["completed"]?.basic.value === 1 &&
            a.values["completionReason"]?.basic.value === 0
        ).length,
        timePlayed: newDungeonActivities.reduce(
          (acc, e) => (e.values["timePlayedSeconds"]?.basic.value ?? 0) + acc,
          0
        ),
      },
      newRaidActivities: {
        count: newRaidActivities.length,
        completed: newRaidActivities.filter(
          (a) =>
            a.values["completed"]?.basic.value === 1 &&
            a.values["completionReason"]?.basic.value === 0
        ).length,
        timePlayed: newRaidActivities.reduce(
          (acc, e) => (e.values["timePlayedSeconds"]?.basic.value ?? 0) + acc,
          0
        ),
      },
      gambitStats: {
        games: gambitGames.length,
        wins: gambitGames.filter(
          (a) =>
            a.values["completed"]?.basic.value === 1 &&
            a.values["standing"]?.basic.value === 0
        ).length,
        kills: gambitGames.reduce(
          (acc, e) => (e.values["kills"]?.basic.value ?? 0) + acc,
          0
        ),
        deaths: gambitGames.reduce(
          (acc, e) => (e.values["deaths"]?.basic.value ?? 0) + acc,
          0
        ),
        assists: gambitGames.reduce(
          (acc, e) => (e.values["assists"]?.basic.value ?? 0) + acc,
          0
        ),
        timePlayed: gambitGames.reduce(
          (acc, e) => (e.values["timePlayedSeconds"]?.basic.value ?? 0) + acc,
          0
        ),
      },
      pvpStats: {
        games: pvpGames.length,
        wins: pvpGames.filter(
          (a) =>
            a.values["completed"]?.basic.value === 1 &&
            a.values["standing"]?.basic.value === 0
        ).length,
        kills: pvpGames.reduce(
          (acc, e) => (e.values["kills"]?.basic.value ?? 0) + acc,
          0
        ),
        deaths: pvpGames.reduce(
          (acc, e) => (e.values["deaths"]?.basic.value ?? 0) + acc,
          0
        ),
        assists: pvpGames.reduce(
          (acc, e) => (e.values["assists"]?.basic.value ?? 0) + acc,
          0
        ),
        timePlayed: pvpGames.reduce(
          (acc, e) => (e.values["timePlayedSeconds"]?.basic.value ?? 0) + acc,
          0
        ),
      },
      pvePvpSplit: {
        pve: groupedByMode.get(7)?.length ?? 0,
        pvp: groupedByMode.get(5)?.length ?? 0,
        ratio:
          (groupedByMode.get(7)?.length ?? 0) /
          (groupedByMode.get(5)?.length ?? 1),
      },
    };
  }, [activities, characterMap]);
