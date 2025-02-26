import React from "react";
import { DestinyProgression } from "bungie-net-core/models";
import { useDestinyManifestComponentsSuspended } from "@/hooks/useDestinyManifestComponent";
import { SeasonPassProgression } from "./SeasonPassProgression";
import { UnclaimedItem } from "@/types";
import { UnclaimedItemCategory } from "./UnclaimedItemCategory";

export const Main = React.memo(
  ({
    characterProgressions,
  }: {
    characterProgressions: DestinyProgression[];
  }) => {
    const [seasonDefs, progressionDefs, itemDefs] =
      useDestinyManifestComponentsSuspended([
        "DestinySeasonDefinition",
        "DestinyProgressionDefinition",
        "DestinyInventoryItemLiteDefinition",
      ]);

    const seasonProgressions = React.useMemo(() => {
      const seasons = Object.values(seasonDefs.data);

      const seasonProgressionHashes = Object.values(seasons)
        .map((season) => season.seasonPassProgressionHash)
        .filter((hash): hash is number => !!hash);

      return Object.values(characterProgressions)
        .filter(({ progressionHash }) =>
          seasonProgressionHashes.includes(progressionHash)
        )
        .map((progression) => {
          const seasonDef = seasons.find(
            (season) =>
              season.seasonPassProgressionHash === progression.progressionHash
          )!;
          return {
            progression,
            seasonDef,
            progressionDef:
              progressionDefs.data[seasonDef.seasonPassProgressionHash!],
          };
        })
        .filter(({ progressionDef }) => !!progressionDef.rewardItems?.length)
        .sort((a, b) => b.seasonDef.seasonNumber - a.seasonDef.seasonNumber);
    }, [characterProgressions, progressionDefs.data, seasonDefs.data]);

    const allUnclaimedItems = React.useMemo(
      () =>
        seasonProgressions.flatMap(
          ({ progression, progressionDef, seasonDef }) =>
            progression.rewardItemStates
              .map(
                (state, rewardIndex): UnclaimedItem => ({
                  progressionHash: progression.progressionHash,
                  progressionDef,
                  seasonDef,
                  rewardItem: progressionDef.rewardItems[rewardIndex],
                  itemDef:
                    itemDefs.data[
                      progressionDef.rewardItems[rewardIndex].itemHash
                    ],
                  state,
                })
              )
              .filter(({ state }) => {
                // the bitmap for the item must be earned (2), but not claimed (4)
                return (state & 2) === 2 && (state & 4) !== 4;
              })
        ),
      [itemDefs.data, seasonProgressions]
    );
    const {
      uncategorized,
      glimmerItems,
      upgradeModules,
      enhancementPrisms,
      enhancementCores,
      ascendantShards,
      ascendantAlloys,
      brightDust,
      deepsightHarmonizers,
      eververseEngrams,
      engrams,
      kineticWeapons,
      energyWeapons,
      powerWeapons,
      strangeCoins,
      finishers,
      exoticCiphers,
      seasonalCurrencies,
      raidBanners,
      helmetArmor,
      armsArmor,
      chestArmor,
      legArmor,
      classArmor,
      ghostShells,
      vehicles,
      ships,
      emotes,
      transmats,
      projections,
      ornaments,
      synthweaves,
      shaders,
    } = React.useMemo(() => {
      const uncategorized: UnclaimedItem[] = [];
      const glimmerItems: UnclaimedItem[] = [];
      const upgradeModules: UnclaimedItem[] = [];
      const enhancementPrisms: UnclaimedItem[] = [];
      const enhancementCores: UnclaimedItem[] = [];
      const ascendantShards: UnclaimedItem[] = [];
      const ascendantAlloys: UnclaimedItem[] = [];
      const brightDust: UnclaimedItem[] = [];
      const deepsightHarmonizers: UnclaimedItem[] = [];
      const eververseEngrams: UnclaimedItem[] = [];
      const engrams: UnclaimedItem[] = [];
      const kineticWeapons: UnclaimedItem[] = [];
      const energyWeapons: UnclaimedItem[] = [];
      const powerWeapons: UnclaimedItem[] = [];
      const strangeCoins: UnclaimedItem[] = [];
      const finishers: UnclaimedItem[] = [];
      const exoticCiphers: UnclaimedItem[] = [];
      const seasonalCurrencies: UnclaimedItem[] = [];
      const raidBanners: UnclaimedItem[] = [];
      const helmetArmor: UnclaimedItem[] = [];
      const armsArmor: UnclaimedItem[] = [];
      const chestArmor: UnclaimedItem[] = [];
      const legArmor: UnclaimedItem[] = [];
      const classArmor: UnclaimedItem[] = [];
      const ghostShells: UnclaimedItem[] = [];
      const vehicles: UnclaimedItem[] = [];
      const ships: UnclaimedItem[] = [];
      const emotes: UnclaimedItem[] = [];
      const transmats: UnclaimedItem[] = [];
      const projections: UnclaimedItem[] = [];
      const ornaments: UnclaimedItem[] = [];
      const synthweaves: UnclaimedItem[] = [];
      const shaders: UnclaimedItem[] = [];

      for (const item of allUnclaimedItems) {
        const { itemDef, rewardItem } = item;
        if (itemDef.collectibleHash === 4055452364) {
          glimmerItems.push(item);
        } else if (itemDef.collectibleHash === 3050404721) {
          upgradeModules.push(item);
        } else if (itemDef.collectibleHash === 927744956) {
          enhancementPrisms.push(item);
        } else if (itemDef.collectibleHash === 2394763654) {
          enhancementCores.push(item);
        } else if (itemDef.collectibleHash === 927744957) {
          ascendantShards.push(item);
        } else if (itemDef.collectibleHash === 2838481597) {
          ascendantAlloys.push(item);
        } else if (rewardItem.itemHash === 2817410917) {
          brightDust.push(item);
        } else if (rewardItem.itemHash === 2228452164) {
          deepsightHarmonizers.push(item);
        } else if (rewardItem.itemHash === 1583786617) {
          synthweaves.push(item);
        } else if (itemDef.itemTypeDisplayName === "Engram") {
          engrams.push(item);
        } else if (rewardItem.itemHash === 1968811824) {
          eververseEngrams.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 1498876634) {
          kineticWeapons.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 2465295065) {
          energyWeapons.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 953998645) {
          powerWeapons.push(item);
        } else if (rewardItem.itemHash === 800069450) {
          strangeCoins.push(item);
        } else if (itemDef.itemType === 29) {
          finishers.push(item);
        } else if (rewardItem.itemHash === 3467984096) {
          exoticCiphers.push(item);
        } else if (itemDef.itemTypeDisplayName === "Seasonal Currency") {
          seasonalCurrencies.push(item);
        } else if (rewardItem.itemHash === 3282419336) {
          raidBanners.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 3448274439) {
          helmetArmor.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 3551918588) {
          armsArmor.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 14239492) {
          chestArmor.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 20886954) {
          legArmor.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 1585787867) {
          classArmor.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 4023194814) {
          ghostShells.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 2025709351) {
          vehicles.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 284967655) {
          ships.push(item);
        } else if (
          itemDef.itemTypeDisplayName === "Emote" ||
          itemDef.itemTypeDisplayName === "Multiplayer Emote"
        ) {
          emotes.push(item);
        } else if (itemDef.itemTypeDisplayName === "Transmat Effect") {
          transmats.push(item);
        } else if (itemDef.itemTypeDisplayName === "Ghost Projection") {
          projections.push(item);
        } else if (itemDef.inventory?.bucketTypeHash === 3313201758) {
          ornaments.push(item);
        } else if (itemDef.itemType === 19) {
          shaders.push(item);
        } else {
          uncategorized.push(item);
        }
      }

      return {
        uncategorized,
        glimmerItems,
        upgradeModules,
        enhancementPrisms,
        enhancementCores,
        ascendantShards,
        ascendantAlloys,
        brightDust,
        deepsightHarmonizers,
        eververseEngrams,
        engrams,
        kineticWeapons,
        energyWeapons,
        powerWeapons,
        strangeCoins,
        finishers,
        exoticCiphers,
        seasonalCurrencies,
        raidBanners,
        helmetArmor,
        armsArmor,
        chestArmor,
        legArmor,
        classArmor,
        ghostShells,
        vehicles,
        ships,
        emotes,
        transmats,
        projections,
        ornaments,
        synthweaves,
        shaders,
      };
    }, [allUnclaimedItems]);

    return (
      <div>
        <h1>Unclaimed Rewards</h1>
        <div className="flex flex-wrap gap-4">
          <UnclaimedItemCategory category="Glimmer" items={glimmerItems} />
          <UnclaimedItemCategory
            category="Upgrade Modules"
            items={upgradeModules}
          />
          <UnclaimedItemCategory
            category="Enhancement Prisms"
            items={enhancementPrisms}
          />
          <UnclaimedItemCategory
            category="Enhancement Cores"
            items={enhancementCores}
          />
          <UnclaimedItemCategory
            category="Ascendant Shards"
            items={ascendantShards}
          />
          <UnclaimedItemCategory
            category="Ascendant Alloys"
            items={ascendantAlloys}
          />
          <UnclaimedItemCategory category="Bright Dust" items={brightDust} />
          <UnclaimedItemCategory
            category="Deepsight Harmonizers"
            items={deepsightHarmonizers}
          />
          <UnclaimedItemCategory category="Engrams" items={engrams} />
          <UnclaimedItemCategory
            category="Eververse Engrams"
            items={eververseEngrams}
          />
          <UnclaimedItemCategory
            category="Kinetic Weapons"
            items={kineticWeapons}
          />
          <UnclaimedItemCategory
            category="Energy Weapons"
            items={energyWeapons}
          />
          <UnclaimedItemCategory
            category="Power Weapons"
            items={powerWeapons}
          />
          <UnclaimedItemCategory
            category="Strange Coins"
            items={strangeCoins}
          />
          <UnclaimedItemCategory category="Finishers" items={finishers} />
          <UnclaimedItemCategory
            category="Exotic Ciphers"
            items={exoticCiphers}
          />
          <UnclaimedItemCategory
            category="Seasonal Currencies"
            items={seasonalCurrencies}
          />
          <UnclaimedItemCategory category="Raid Banners" items={raidBanners} />
          <UnclaimedItemCategory category="Helmet Armor" items={helmetArmor} />
          <UnclaimedItemCategory category="Arms Armor" items={armsArmor} />
          <UnclaimedItemCategory category="Chest Armor" items={chestArmor} />
          <UnclaimedItemCategory category="Leg Armor" items={legArmor} />
          <UnclaimedItemCategory category="Class Armor" items={classArmor} />
          <UnclaimedItemCategory category="Ghost Shells" items={ghostShells} />
          <UnclaimedItemCategory category="Vehicles" items={vehicles} />
          <UnclaimedItemCategory category="Ships" items={ships} />
          <UnclaimedItemCategory category="Emotes" items={emotes} />
          <UnclaimedItemCategory
            category="Transmat Effects"
            items={transmats}
          />
          <UnclaimedItemCategory
            category="Ghost Projections"
            items={projections}
          />
          <UnclaimedItemCategory category="Ornaments" items={ornaments} />
          <UnclaimedItemCategory category="Synthweaves" items={synthweaves} />
          <UnclaimedItemCategory category="Shaders" items={shaders} />
          <UnclaimedItemCategory
            category="Uncategorized"
            items={uncategorized}
          />
        </div>
        <div className="flex flex-col items-center">
          {seasonProgressions.map(
            ({ progression, seasonDef, progressionDef }) => (
              <SeasonPassProgression
                key={progression.progressionHash}
                progression={progression}
                seasonDef={seasonDef}
                progressionDef={progressionDef}
              />
            )
          )}
        </div>
      </div>
    );
  }
);
Main.displayName = "Main";
