import React from "react";
import {
  DestinyCharacterComponent,
  DestinyProgression,
} from "bungie-net-core/models";
import { useDestinyManifestComponentsSuspended } from "@/hooks/useDestinyManifestComponent";
import { UnclaimedItem } from "@/types";
import { UnclaimedItemCategory } from "./ItemCategory";
import { CollapseManager } from "./CollapseManager";

export const Main = React.memo(
  ({
    profileProgressions,
    characters,
  }: {
    profileProgressions: DestinyProgression[];
    characters: Record<string, DestinyCharacterComponent>;
  }) => {
    const [seasonDefs, progressionDefs, itemDefs] =
      useDestinyManifestComponentsSuspended([
        "DestinySeasonDefinition",
        "DestinyProgressionDefinition",
        "DestinyInventoryItemLiteDefinition",
      ]);

    const primaryCharacter = Object.values(characters).sort(
      (a, b) =>
        new Date(b.dateLastPlayed).getTime() -
        new Date(a.dateLastPlayed).getTime()
    )[0];

    const seasonProgressions = React.useMemo(() => {
      const seasons = Object.values(seasonDefs.data);

      const seasonProgressionHashes = Object.values(seasons)
        .map((season) => season.seasonPassProgressionHash)
        .filter((hash): hash is number => !!hash);

      return Object.values(profileProgressions)
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
    }, [profileProgressions, progressionDefs.data, seasonDefs.data]);

    const allUnclaimedItems = React.useMemo(() => {
      const characterMap = Object.fromEntries(
        Object.entries(characters).map(
          ([id, component]) => [component.classType, id] as const
        )
      );

      return seasonProgressions.flatMap(
        ({ progression, progressionDef, seasonDef }) =>
          progression.rewardItemStates
            .map((state, rewardIndex): UnclaimedItem => {
              const itemDef =
                itemDefs.data[progressionDef.rewardItems[rewardIndex].itemHash];
              const characterId =
                characterMap[itemDef.classType] ?? primaryCharacter.characterId;

              return {
                characterId,
                characterClass: characters[characterId].classType,
                membershipType: primaryCharacter.membershipType,
                progressionHash: progression.progressionHash,
                progressionDef,
                seasonDef,
                rewardItemSocketOverrideStates:
                  progression.rewardItemSocketOverrideStates[rewardIndex],
                rewardItem: progressionDef.rewardItems[rewardIndex],
                itemDef,
                state,
              };
            })
            .filter(({ state }) => {
              // the bitmap for the item must be earned (2), but not claimed (4)
              return (state & 2) === 2 && (state & 4) !== 4;
            })
      );
    }, [
      characters,
      itemDefs.data,
      primaryCharacter.characterId,
      primaryCharacter.membershipType,
      seasonProgressions,
    ]);
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
      exoticEngrams,
      legendaryEngrams,
      seasonalEngrams,
      kineticWeapons,
      energyWeapons,
      powerWeapons,
      strangeCoins,
      finishers,
      exoticCiphers,
      seasonalCurrencies,
      raidBanners,
      hunterHelmets,
      hunterArms,
      hunterChests,
      hunterLegs,
      hunterCloaks,
      warlockHelmets,
      warlockArms,
      warlockRobes,
      warlockLegs,
      warlockBonds,
      titanHelmets,
      titanArms,
      titanChests,
      titanLegs,
      titanMarks,
      ghostShells,
      vehicles,
      ships,
      emotes,
      transmats,
      projections,
      ornaments,
      synthweaves,
      shaders,
    } = useCategorizedItems(allUnclaimedItems);

    return (
      <div className="dark container mx-auto p-4 mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">All Unclaimed Rewards</h1>
          <p className="text-sm text-gray-400">
            Powered by the Destiny 2 Season Pass Wayback Machine
          </p>
        </div>
        <div className="flex flex-wrap gap-8">
          <CollapseManager>
            <UnclaimedItemCategory
              category="Glimmer"
              items={glimmerItems}
              variant="currency"
            />
            <UnclaimedItemCategory
              category="Upgrade Modules"
              items={upgradeModules}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Enhancement Cores"
              items={enhancementCores}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Enhancement Prisms"
              items={enhancementPrisms}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Ascendant Shards"
              items={ascendantShards}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Ascendant Alloys"
              items={ascendantAlloys}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Deepsight Harmonizers"
              items={deepsightHarmonizers}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Exotic Ciphers"
              items={exoticCiphers}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Raid Banners"
              items={raidBanners}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Strange Coins"
              items={strangeCoins}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Seasonal Currencies"
              items={seasonalCurrencies}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Synthweaves"
              items={synthweaves}
              variant="material"
            />
            <UnclaimedItemCategory
              category="Bright Dust"
              items={brightDust}
              variant="currency"
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
              category="Hunter Helmets"
              items={hunterHelmets}
            />
            <UnclaimedItemCategory category="Hunter Grips" items={hunterArms} />
            <UnclaimedItemCategory
              category="Hunter Vests"
              items={hunterChests}
            />
            <UnclaimedItemCategory
              category="Hunter Strides"
              items={hunterLegs}
            />
            <UnclaimedItemCategory
              category="Hunter Cloaks"
              items={hunterCloaks}
            />

            <UnclaimedItemCategory
              category="Warlock Hoods"
              items={warlockHelmets}
            />
            <UnclaimedItemCategory
              category="Warlock Gloves"
              items={warlockArms}
            />
            <UnclaimedItemCategory
              category="Warlock Robes"
              items={warlockRobes}
            />
            <UnclaimedItemCategory
              category="Warlock Boots"
              items={warlockLegs}
            />
            <UnclaimedItemCategory
              category="Warlock Bonds"
              items={warlockBonds}
            />

            <UnclaimedItemCategory
              category="Titan Helmets"
              items={titanHelmets}
            />
            <UnclaimedItemCategory
              category="Titan Gauntlets"
              items={titanArms}
            />
            <UnclaimedItemCategory
              category="Titan Chestplates"
              items={titanChests}
            />
            <UnclaimedItemCategory category="Titan Greaves" items={titanLegs} />
            <UnclaimedItemCategory category="Titan Marks" items={titanMarks} />

            <UnclaimedItemCategory
              category="Exotic Engrams"
              items={exoticEngrams}
              variant="engram"
            />
            <UnclaimedItemCategory
              category="Legendary Engrams"
              items={legendaryEngrams}
              variant="engram"
            />
            <UnclaimedItemCategory
              category="Seasonal Engrams"
              items={seasonalEngrams}
              variant="engram"
            />
            <UnclaimedItemCategory
              category="Eververse Engrams"
              items={eververseEngrams}
              variant="engram"
            />

            <UnclaimedItemCategory category="Ornaments" items={ornaments} />

            <UnclaimedItemCategory category="Shaders" items={shaders} />
            <UnclaimedItemCategory category="Finishers" items={finishers} />
            <UnclaimedItemCategory category="Emotes" items={emotes} />
            <UnclaimedItemCategory category="Vehicles" items={vehicles} />
            <UnclaimedItemCategory category="Ships" items={ships} />
            <UnclaimedItemCategory
              category="Ghost Shells"
              items={ghostShells}
            />
            <UnclaimedItemCategory
              category="Ghost Projections"
              items={projections}
            />
            <UnclaimedItemCategory
              category="Transmat Effects"
              items={transmats}
            />

            <UnclaimedItemCategory
              category="Uncategorized"
              items={uncategorized}
            />
          </CollapseManager>
        </div>
      </div>
    );
  }
);
Main.displayName = "Main";

const useCategorizedItems = (items: UnclaimedItem[]) =>
  React.useMemo(() => {
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
    const legendaryEngrams: UnclaimedItem[] = [];
    const seasonalEngrams: UnclaimedItem[] = [];
    const exoticEngrams: UnclaimedItem[] = [];
    const kineticWeapons: UnclaimedItem[] = [];
    const energyWeapons: UnclaimedItem[] = [];
    const powerWeapons: UnclaimedItem[] = [];
    const strangeCoins: UnclaimedItem[] = [];
    const finishers: UnclaimedItem[] = [];
    const exoticCiphers: UnclaimedItem[] = [];
    const seasonalCurrencies: UnclaimedItem[] = [];
    const raidBanners: UnclaimedItem[] = [];
    const ghostShells: UnclaimedItem[] = [];
    const vehicles: UnclaimedItem[] = [];
    const ships: UnclaimedItem[] = [];
    const emotes: UnclaimedItem[] = [];
    const transmats: UnclaimedItem[] = [];
    const projections: UnclaimedItem[] = [];
    const ornaments: UnclaimedItem[] = [];
    const synthweaves: UnclaimedItem[] = [];
    const shaders: UnclaimedItem[] = [];
    const hunterHelmets: UnclaimedItem[] = [];
    const hunterArms: UnclaimedItem[] = [];
    const hunterChests: UnclaimedItem[] = [];
    const hunterLegs: UnclaimedItem[] = [];
    const hunterCloaks: UnclaimedItem[] = [];
    const warlockHelmets: UnclaimedItem[] = [];
    const warlockArms: UnclaimedItem[] = [];
    const warlockRobes: UnclaimedItem[] = [];
    const warlockLegs: UnclaimedItem[] = [];
    const warlockBonds: UnclaimedItem[] = [];
    const titanHelmets: UnclaimedItem[] = [];
    const titanArms: UnclaimedItem[] = [];
    const titanChests: UnclaimedItem[] = [];
    const titanLegs: UnclaimedItem[] = [];
    const titanMarks: UnclaimedItem[] = [];

    for (const item of items) {
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
      } else if (rewardItem.itemHash === 1968811824) {
        eververseEngrams.push(item);
      } else if (itemDef.displayProperties.name.includes("Legendary Engram")) {
        legendaryEngrams.push(item);
      } else if (itemDef.itemTypeAndTierDisplayName.includes("Exotic Engram")) {
        exoticEngrams.push(item);
      } else if (itemDef.itemTypeDisplayName.includes("Engram")) {
        seasonalEngrams.push(item);
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
        switch (itemDef.classType) {
          case 0:
            titanHelmets.push(item);
            break;
          case 1:
            hunterHelmets.push(item);
            break;
          case 2:
            warlockHelmets.push(item);
            break;
          default:
            uncategorized.push(item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 3551918588) {
        switch (itemDef.classType) {
          case 0:
            titanArms.push(item);
            break;
          case 1:
            hunterArms.push(item);
            break;
          case 2:
            warlockArms.push(item);
            break;
          default:
            uncategorized.push(item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 14239492) {
        switch (itemDef.classType) {
          case 0:
            titanChests.push(item);
            break;
          case 1:
            hunterChests.push(item);
            break;
          case 2:
            warlockRobes.push(item);
            break;
          default:
            uncategorized.push(item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 20886954) {
        switch (itemDef.classType) {
          case 0:
            titanLegs.push(item);
            break;
          case 1:
            hunterLegs.push(item);
            break;
          case 2:
            warlockLegs.push(item);
            break;
          default:
            uncategorized.push(item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 1585787867) {
        switch (itemDef.classType) {
          case 0:
            titanMarks.push(item);
            break;
          case 1:
            hunterCloaks.push(item);
            break;
          case 2:
            warlockBonds.push(item);
            break;
          default:
            uncategorized.push(item);
        }
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
      exoticEngrams,
      legendaryEngrams,
      seasonalEngrams,
      eververseEngrams,
      kineticWeapons,
      energyWeapons,
      powerWeapons,
      strangeCoins,
      finishers,
      exoticCiphers,
      seasonalCurrencies,
      raidBanners,
      hunterHelmets,
      hunterArms,
      hunterChests,
      hunterLegs,
      hunterCloaks,
      warlockHelmets,
      warlockArms,
      warlockRobes,
      warlockLegs,
      warlockBonds,
      titanHelmets,
      titanArms,
      titanChests,
      titanLegs,
      titanMarks,
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
  }, [items]);
