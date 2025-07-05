import React from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/app/components/modals/ConfirmationModal";
import { useClaimItem } from "@/app/hooks/useClaimItem";
import { useDestinyManifestComponentsSuspended } from "@/app/hooks/useDestinyManifestComponent";
import { cn } from "@/app/lib/utils";
import { ItemVariant, UnclaimedItem } from "@/types";

export const SeasonPassItem = React.memo(
  ({ item, variant }: { item: UnclaimedItem; variant: ItemVariant }) => {
    const [classDefs] = useDestinyManifestComponentsSuspended([
      "DestinyClassDefinition"
    ]);
    const classNameMap = Object.fromEntries(
      Object.values(classDefs.data).map((classDef) => [
        classDef.classType,
        classDef.displayProperties.name
      ])
    );

    const [isClaimed, setIsClaimed] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

    const quantity = item.rewardItem.quantity;
    const isShowQuantity = variant === "currency" || variant === "material";
    const isDeepsight =
      variant === "item" &&
      item.rewardItem.socketOverrides.some(
        (socket) => socket.overrideSingleItemHash === 213377779
      );
    const isClaimableByCharacter =
      item.itemCharacterClass === 3 ||
      item.itemCharacterClass === item.transferCharacter.classType;

    const { mutate: claimItem } = useClaimItem(
      {
        characterId: item.transferCharacter.characterId,
        membershipType: item.membershipType,
        rewardIndex: item.rewardItem.rewardItemIndex,
        seasonHash: item.seasonDef.hash,
        progressionHash: item.progressionHash
      },
      {
        onError: (error) => {
          toast.error("Error Claiming Item", {
            description: error.message
          });
        },
        onSuccess: () => {
          toast.success("Item claimed", {
            description: `${quantity} ${item.itemDef.displayProperties.name} has been transferred to the inventory of your ${
              classNameMap[item.transferCharacter.classType]
            }`
          });
          setIsClaimed(true);
        }
      }
    );

    return (
      <>
        <div
          className={cn(
            "group relative flex h-14 w-14 cursor-pointer flex-col items-center rounded-[0.125rem] border-2 border-gray-500 transition-[scale] md:h-20 md:w-20",
            {
              "border-2 border-red-600/75": isDeepsight,
              "hover:scale-[1.03]": !isClaimed,
              "opacity-50": isClaimed
            }
          )}
          onClick={(e) => {
            console.log(item);
            if (
              isClaimed ||
              !isClaimableByCharacter ||
              !item.canClaimThisSeason
            ) {
              return;
            }

            const isBypassConfirmation = e.ctrlKey || e.metaKey;

            if (isBypassConfirmation) {
              claimItem();
            } else {
              setIsConfirmModalOpen(true);
            }
          }}
        >
          <img
            src={`https://www.bungie.net${item.itemDef.displayProperties.icon}`}
            alt={item.itemDef.displayProperties.name}
            className={cn("absolute h-full w-full object-cover", {
              grayscale:
                isClaimed || !isClaimableByCharacter || !item.canClaimThisSeason
            })}
          />
          {item.itemDef.iconWatermark && (
            <img
              src={`https://www.bungie.net${item.itemDef.iconWatermark}`}
              className="absolute h-full w-full object-cover"
              alt=""
            />
          )}

          {/* tooltip */}
          <div className="bottom-[90%] mb-1 hidden min-w-[200%] rounded bg-black/95 p-3 text-white group-hover:absolute group-hover:block">
            {!isClaimableByCharacter && (
              <p className="text-sm text-red-500">
                Could not find available character to claim item
              </p>
            )}
            {!item.canClaimThisSeason && (
              <p className="text-sm text-yellow-500">
                Season has not ended. Item cannot yet be claimed via the API.
                You must claim this item in-game.
              </p>
            )}
            <p className="text-lg text-nowrap">
              {item.itemCharacterClass !== 3
                ? `${classNameMap[item.itemCharacterClass]} - `
                : ""}
              {item.itemDef.displayProperties.name}
            </p>
            <p className="text-sm text-gray-400">
              {`${item.seasonDef.displayProperties.name} (${item.seasonDef.seasonNumber})`}
            </p>
            <p className="text-sm text-gray-200">
              {`Rank ${item.rewardItem.rewardedAtProgressionLevel}`}
            </p>
          </div>

          {isShowQuantity && (
            <div
              className={cn(
                "absolute right-0 bottom-0 rounded-sm bg-black/70 px-2 text-sm text-white transition-opacity",
                {
                  "text-base": quantity < 100
                }
              )}
            >
              <span className="font-semibold">{quantity.toLocaleString()}</span>
            </div>
          )}
        </div>

        <ConfirmationDialog
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={claimItem}
          title="Confirm Item Claim"
          message={[
            `Are you sure you want to claim ${quantity} ${item.itemDef.displayProperties.name} from ${item.seasonDef.displayProperties.name}?`,
            `Note: This item will be transferred to the inventory of your ${classNameMap[item.transferCharacter.classType]}.`,
            "This action is irreversible."
          ]}
        />
      </>
    );
  }
);
SeasonPassItem.displayName = "SeasonPassItem";
