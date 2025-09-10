import React from "react";
import {
  DestinyCharacterComponent,
  DestinyCharacterProgressionComponent,
  DestinyClass,
  DestinySeasonDefinition,
  DestinySeasonPassReference
} from "bungie-net-core/models";
import { useDestinyManifestComponentsSuspended } from "@/app/hooks/useDestinyManifestComponent";
import { ItemVariant, UnclaimedItem } from "@/types";
import { CollapseManager } from "./CollapseManager";
import { UnclaimedItemCategory } from "./ItemCategory";

export const Main = React.memo(
  ({
    profileProgressions,
    characters
  }: {
    profileProgressions: Record<string, DestinyCharacterProgressionComponent>;
    characters: Record<string, DestinyCharacterComponent>;
  }) => {
    const [seasonDefs, seasonPassDefs, progressionDefs, itemDefs, classDefs] =
      useDestinyManifestComponentsSuspended([
        "DestinySeasonDefinition",
        "DestinySeasonPassDefinition",
        "DestinyProgressionDefinition",
        "DestinyInventoryItemDefinition",
        "DestinyClassDefinition"
      ]);

    const [primaryCharacterId, setPrimaryCharacterId] = React.useState(
      () =>
        Object.values(characters).sort(
          (a, b) =>
            new Date(b.dateLastPlayed).getTime() -
            new Date(a.dateLastPlayed).getTime()
        )[0].characterId
    );
    const primaryCharacter = characters[primaryCharacterId];

    const characterProgressions =
      profileProgressions[primaryCharacterId].progressions;

    React.useEffect(() => {
      // Get the Bungie character selector dropdown to sync into the extension
      const characterSelectOld = document.querySelector(
        'div[aria-selected="true"][class^="Dropdown_selectOption"][data-value^="230584"]'
      );

      const selectorDivOld = characterSelectOld?.parentNode?.parentNode;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            const element = node as HTMLDivElement;
            if (element.getAttribute("aria-selected") === "true") {
              const characterId = element.getAttribute("data-value")!;
              if (characterId) {
                setPrimaryCharacterId(characterId);
              }
            }
          });
        });
      });

      if (selectorDivOld) {
        observer.observe(selectorDivOld, {
          childList: true,
          subtree: true
        });
      }

      return () => {
        observer.disconnect();
      };
    }, []);

    // Monitor the new character selector for changes
    React.useEffect(() => {
      const characterSelectNew = document.querySelector(
        'input[class^="MuiSelect-nativeInput"][value^="230584"]'
      ) as HTMLInputElement | null;

      const observer = new MutationObserver(() => {
        if (characterSelectNew) {
          setPrimaryCharacterId(characterSelectNew.value);
        }
      });

      if (characterSelectNew) {
        observer.observe(characterSelectNew, {
          attributes: true,
          attributeFilter: ["value"]
        });
      }

      return () => {
        observer.disconnect();
      };
    }, []);

    const seasonProgressions = React.useMemo(() => {
      const seasonPasses = Object.values(seasonPassDefs.data);
      const seasons = Object.values(seasonDefs.data);

      const seasonProgressionHashes = Object.values(seasonPasses)
        .map((pass) => pass.rewardProgressionHash)
        .filter((hash): hash is number => !!hash);

      return Object.values(characterProgressions)
        .filter(({ progressionHash }) =>
          seasonProgressionHashes.includes(progressionHash)
        )
        .map((progression) => {
          const passDef = seasonPasses.find(
            (pass) => pass.rewardProgressionHash === progression.progressionHash
          )!;

          let passRef: DestinySeasonPassReference | null = null;
          let seasonDef: DestinySeasonDefinition | null = null;
          for (const season of seasons) {
            const foundPass = season.seasonPassList.find(
              (pass) => pass.seasonPassHash === passDef.hash
            );
            if (foundPass) {
              passRef = foundPass;
              seasonDef = season;
              break;
            }
          }

          if (!seasonDef || !passRef) {
            throw new Error(
              `Could not find season or pass for progression hash ${progression.progressionHash}`
            );
          }

          return {
            progression,
            seasonDef,
            passDef,
            passRef,
            progressionDef: progressionDefs.data[progression.progressionHash]
          };
        })
        .filter(({ progressionDef }) => !!progressionDef.rewardItems?.length);
    }, [
      characterProgressions,
      progressionDefs.data,
      seasonDefs.data,
      seasonPassDefs.data
    ]);

    const earliestVisibileSeason = React.useMemo(
      () =>
        seasonProgressions.sort(
          (a, b) => a.seasonDef.seasonNumber - b.seasonDef.seasonNumber
        )[0].seasonDef,
      [seasonProgressions]
    );
    const earliestVisibileSeasonStartDate = earliestVisibileSeason.startDate
      ? new Date(earliestVisibileSeason.startDate).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "long"
          }
        )
      : "Unknown";

    const allUnclaimedItems = React.useMemo(() => {
      const characterMap = Object.fromEntries(
        Object.values(characters).map(
          (component) => [component.classType, component] as const
        )
      );

      const classCategoryIdentifierRegex =
        /armor_skins_(titan|hunter|warlock)_/;
      const classRegexMapping: Record<string, DestinyClass> = {
        titan: 0,
        hunter: 1,
        warlock: 2
      };
      const now = Date.now();

      return seasonProgressions.flatMap(
        ({ progression, progressionDef, seasonDef, passRef, passDef }) =>
          progression.rewardItemStates
            .map((state, rewardIndex): UnclaimedItem => {
              const itemDef =
                itemDefs.data[progressionDef.rewardItems[rewardIndex].itemHash];

              const matchClassCategory =
                itemDef.plug?.plugCategoryIdentifier?.match(
                  classCategoryIdentifierRegex
                );

              const characterClass =
                itemDef.classType !== 3
                  ? itemDef.classType
                  : (classRegexMapping[matchClassCategory?.[1] ?? ""] ?? 3);

              const characterComponent =
                characterMap[characterClass] ?? primaryCharacter;

              return {
                transferCharacter: characterComponent,
                itemCharacterClass: characterClass,
                membershipType: primaryCharacter.membershipType,
                progressionHash: progression.progressionHash,
                progressionDef,
                seasonDef,
                seasonPassDef: passDef,
                rewardItemSocketOverrideStates:
                  progression.rewardItemSocketOverrideStates[rewardIndex],
                rewardItem: progressionDef.rewardItems[rewardIndex],
                itemDef,
                state,
                canClaimThisSeason:
                  new Date(
                    passRef.seasonPassEndDate ?? Number.MAX_SAFE_INTEGER
                  ).getTime() < now
              };
            })
            .filter(({ state, rewardItem }) => {
              return (
                // "Hidden Legendary Weapon Rewards" (4147131133) are not real items; they are duplicates
                rewardItem.itemHash !== 4147131133 &&
                // the bitmap for the item must be earned (2), not claimed (4), and claimable (8) or invisible (1)
                (state & (2 | 4)) === 2 &&
                (state & (1 | 8)) > 0
              );
            })
      );
    }, [characters, itemDefs.data, primaryCharacter, seasonProgressions]);

    const categorizedItems = useCategorizedItems(allUnclaimedItems);

    const totalUnclaimedItems = allUnclaimedItems.length;

    return (
      <div className="dark container mx-auto mb-8 p-4">
        <div className="mb-6">
          <h1 className="mb-4 text-2xl font-bold">
            All Unclaimed Season Pass Rewards
          </h1>
          <p className="mb-2 text-sm text-gray-400">
            Powered by the Destiny 2 Season Pass Wayback Machine
          </p>
          {totalUnclaimedItems > 0 && (
            <div className="mb-2 text-lg font-semibold">
              <span>{"You have a total of "}</span>
              <span className="text-xl text-sky-400">
                {totalUnclaimedItems.toLocaleString()}
              </span>
              <span>{` unclaimed item${
                totalUnclaimedItems > 1 ? "s" : ""
              } across all seasons.`}</span>
            </div>
          )}
          <p className="mb-2 text-sm text-gray-400 italic">
            {`Unfortunately, some season pass data from older seasons has been deleted from the Bungie API. The extension can only pull data from seasons as far back as ${earliestVisibileSeason.displayProperties.name} (${earliestVisibileSeasonStartDate}).`}
          </p>

          <p className="text-lg font-semibold">
            <span>
              {
                "All non-class-specific items will transfer to the inventory of your"
              }
            </span>
            <select
              value={primaryCharacterId}
              onChange={(e) => setPrimaryCharacterId(e.target.value)}
              className="ml-1 cursor-pointer text-xl text-green-400"
            >
              {Object.values(characters).map((char) => (
                <option
                  key={char.characterId}
                  value={char.characterId}
                  className="text-base text-popover"
                >
                  {Object.values(classDefs.data).find(
                    (def) => def.classType === char.classType
                  )?.displayProperties.name ?? "Unknown"}
                </option>
              ))}
            </select>
          </p>
        </div>

        {totalUnclaimedItems > 0 ? (
          <div className="flex flex-wrap gap-8">
            <CollapseManager>
              {categorizedItems.map((category) => (
                <UnclaimedItemCategory key={category.category} {...category} />
              ))}
            </CollapseManager>
          </div>
        ) : (
          <div className="w-full text-center">
            <h3 className="text-xl font-bold">No unclaimed items found</h3>
            <p className="text-gray-400">
              You have no unclaimed items on your account.
            </p>
          </div>
        )}
      </div>
    );
  }
);
Main.displayName = "Main";

const useCategorizedItems = (items: UnclaimedItem[]) =>
  React.useMemo((): {
    category: string;
    items: UnclaimedItem[];
    variant?: ItemVariant;
  }[] => {
    const createCategorySet = (category: string, variant?: ItemVariant) => ({
      category,
      items: [] as UnclaimedItem[],
      variant
    });

    const categories = {
      deepsightHarmonizers: createCategorySet(
        "Deepsight Harmonizers",
        "material"
      ),
      exoticCiphers: createCategorySet("Exotic Ciphers", "material"),
      ascendantAlloys: createCategorySet("Ascendant Alloys", "material"),
      ascendantShards: createCategorySet("Ascendant Shards", "material"),
      unstableCores: createCategorySet("Unstable Cores", "material"),
      enhancementPrisms: createCategorySet("Enhancement Prisms", "material"),
      enhancementCores: createCategorySet("Enhancement Cores", "material"),
      raidBanners: createCategorySet("Raid Banners", "material"),
      glimmer: createCategorySet("Glimmer", "currency"),
      strangeCoins: createCategorySet("Strange Coins", "material"),
      seasonalCurrencies: createCategorySet("Seasonal Currencies", "material"),
      brightDust: createCategorySet("Bright Dust", "currency"),
      exoticEngrams: createCategorySet("Exotic Engrams", "engram"),
      eververseEngrams: createCategorySet("Eververse Engrams", "engram"),
      ornaments: createCategorySet("Ornaments"),
      synthweaves: createCategorySet("Synthweaves", "material"),
      shaders: createCategorySet("Shaders"),
      finishers: createCategorySet("Finishers"),
      emotes: createCategorySet("Emotes"),
      vehicles: createCategorySet("Vehicles"),
      ships: createCategorySet("Ships"),
      ghostShells: createCategorySet("Ghost Shells"),
      projections: createCategorySet("Ghost Projections"),
      transmats: createCategorySet("Transmat Effects"),
      kineticWeapons: createCategorySet("Kinetic Weapons"),
      energyWeapons: createCategorySet("Energy Weapons"),
      powerWeapons: createCategorySet("Power Weapons"),
      hunterHelmets: createCategorySet("Hunter Helmets"),
      hunterArms: createCategorySet("Hunter Grips"),
      hunterChests: createCategorySet("Hunter Vests"),
      hunterLegs: createCategorySet("Hunter Strides"),
      hunterCloaks: createCategorySet("Hunter Cloaks"),
      warlockHelmets: createCategorySet("Warlock Hoods"),
      warlockArms: createCategorySet("Warlock Gloves"),
      warlockRobes: createCategorySet("Warlock Robes"),
      warlockLegs: createCategorySet("Warlock Boots"),
      warlockBonds: createCategorySet("Warlock Bonds"),
      titanHelmets: createCategorySet("Titan Helmets"),
      titanArms: createCategorySet("Titan Gauntlets"),
      titanChests: createCategorySet("Titan Chestplates"),
      titanLegs: createCategorySet("Titan Greaves"),
      titanMarks: createCategorySet("Titan Marks"),
      portalEngrams: createCategorySet("Portal Engrams", "engram"),
      seasonalEngrams: createCategorySet("Seasonal Engrams", "engram"),
      legendaryEngrams: createCategorySet("Legendary Engrams", "engram"),
      upgradeModules: createCategorySet("Upgrade Modules", "material"),
      uncategorized: createCategorySet("Uncategorized")
    };

    const push = (category: keyof typeof categories, item: UnclaimedItem) => {
      categories[category].items.push(item);
    };

    for (const item of items) {
      const { itemDef, rewardItem } = item;
      if (itemDef.collectibleHash === 4055452364) {
        push("glimmer", item);
      } else if (itemDef.collectibleHash === 3050404721) {
        push("upgradeModules", item);
      } else if (itemDef.collectibleHash === 927744956) {
        push("enhancementPrisms", item);
      } else if (itemDef.collectibleHash === 2394763654) {
        push("enhancementCores", item);
      } else if (rewardItem.itemHash === 2718300701) {
        push("unstableCores", item);
      } else if (itemDef.collectibleHash === 927744957) {
        push("ascendantShards", item);
      } else if (itemDef.collectibleHash === 2838481597) {
        push("ascendantAlloys", item);
      } else if (rewardItem.itemHash === 2817410917) {
        push("brightDust", item);
      } else if (rewardItem.itemHash === 2228452164) {
        push("deepsightHarmonizers", item);
      } else if (rewardItem.itemHash === 1583786617) {
        push("synthweaves", item);
      } else if (rewardItem.itemHash === 1968811824) {
        push("eververseEngrams", item);
      } else if (rewardItem.itemHash === 1260977951) {
        push("legendaryEngrams", item);
      } else if ([3875551374, 903043774].includes(rewardItem.itemHash)) {
        push("exoticEngrams", item);
      } else if (
        [375726501, 1558457900].includes(itemDef.inventory?.bucketTypeHash ?? 0)
      ) {
        push("seasonalEngrams", item);
      } else if (itemDef.inventory?.bucketTypeHash === 1498876634) {
        push("kineticWeapons", item);
      } else if (itemDef.inventory?.bucketTypeHash === 2465295065) {
        push("energyWeapons", item);
      } else if (itemDef.inventory?.bucketTypeHash === 953998645) {
        push("powerWeapons", item);
      } else if (rewardItem.itemHash === 800069450) {
        push("strangeCoins", item);
      } else if (itemDef.itemType === 29) {
        push("finishers", item);
      } else if (rewardItem.itemHash === 3467984096) {
        push("exoticCiphers", item);
      } else if (rewardItem.itemHash === 3282419336) {
        push("raidBanners", item);
      } else if (itemDef.inventory?.bucketTypeHash === 3448274439) {
        switch (itemDef.classType) {
          case 0:
            push("titanHelmets", item);
            break;
          case 1:
            push("hunterHelmets", item);
            break;
          case 2:
            push("warlockHelmets", item);
            break;
          default:
            push("uncategorized", item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 3551918588) {
        switch (itemDef.classType) {
          case 0:
            push("titanArms", item);
            break;
          case 1:
            push("hunterArms", item);
            break;
          case 2:
            push("warlockArms", item);
            break;
          default:
            push("uncategorized", item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 14239492) {
        switch (itemDef.classType) {
          case 0:
            push("titanChests", item);
            break;
          case 1:
            push("hunterChests", item);
            break;
          case 2:
            push("warlockRobes", item);
            break;
          default:
            push("uncategorized", item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 20886954) {
        switch (itemDef.classType) {
          case 0:
            push("titanLegs", item);
            break;
          case 1:
            push("hunterLegs", item);
            break;
          case 2:
            push("warlockLegs", item);
            break;
          default:
            push("uncategorized", item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 1585787867) {
        switch (itemDef.classType) {
          case 0:
            push("titanMarks", item);
            break;
          case 1:
            push("hunterCloaks", item);
            break;
          case 2:
            push("warlockBonds", item);
            break;
          default:
            push("uncategorized", item);
        }
      } else if (itemDef.inventory?.bucketTypeHash === 4023194814) {
        push("ghostShells", item);
      } else if (itemDef.inventory?.bucketTypeHash === 2025709351) {
        push("vehicles", item);
      } else if (itemDef.inventory?.bucketTypeHash === 284967655) {
        push("ships", item);
      } else if (itemDef.itemCategoryHashes?.includes(44)) {
        push("emotes", item);
      } else if (itemDef.itemCategoryHashes?.includes(177260082)) {
        push("transmats", item);
      } else if (itemDef.itemCategoryHashes?.includes(1449602859)) {
        push("projections", item);
      } else if (itemDef.inventory?.bucketTypeHash === 3313201758) {
        push("ornaments", item);
      } else if (itemDef.itemCategoryHashes?.includes(41)) {
        push("shaders", item);
      } else if (itemDef.inventory?.bucketTypeHash === 1469714392) {
        push("seasonalCurrencies", item);
      } else if (
        itemDef.inventory?.tierTypeHash === 4008398120 &&
        itemDef.traitIds?.includes("item.engram")
      ) {
        push("portalEngrams", item);
      } else {
        push("uncategorized", item);
      }
    }

    return Object.values(categories);
  }, [items]);
