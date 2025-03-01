import type { BungieHttpProtocol } from "bungie-net-core";
import {
  getDestinyManifest,
  getLinkedProfiles,
  getProfile
} from "bungie-net-core/endpoints/Destiny2";
import {
  AllDestinyManifestComponents,
  DestinyManifestLanguage,
  getDestinyManifestComponent
} from "bungie-net-core/manifest";
import {
  BungieMembershipType,
  BungieNetResponse,
  DestinyManifest
} from "bungie-net-core/models";
import { getCookie } from "./cookie";

export class BungieHttpClient {
  private platformHttp: BungieHttpProtocol = async (config) => {
    const headers = new Headers({
      "x-api-key": import.meta.env.VITE_BUNGIE_API_KEY!,
      "x-csrf": getCookie("bungled")
    });

    if (config.contentType) {
      headers.set("Content-Type", config.contentType);
    }

    const params = new URLSearchParams(getCookie("bungleloc"));
    config.searchParams?.forEach((value, key) => {
      params.set(key, value);
    });
    const url = config.baseUrl + `?${params}`;

    const response = await fetch(url, {
      credentials: "same-origin",
      method: config.method,
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined
    });

    if (response.headers.get("Content-Type")?.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message, {
          cause: data
        });
      }

      return data;
    } else {
      throw new Error(response.statusText, {
        cause: response
      });
    }
  };

  private manifestComponentHttp: BungieHttpProtocol = async (config) => {
    const response = await fetch(config.baseUrl, {
      method: "GET"
    });

    if (response.headers.get("Content-Type")?.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message, {
          cause: data
        });
      }

      return data;
    } else {
      throw new Error(response.statusText, {
        cause: response
      });
    }
  };

  async getManifest() {
    return await getDestinyManifest(this.platformHttp).then(
      (res) => res.Response
    );
  }

  async getManifestComponent<T extends keyof AllDestinyManifestComponents>(
    tableName: T,
    destinyManifest: DestinyManifest
  ) {
    const lc = (new URLSearchParams(getCookie("bungleloc")).get("lc") ??
      "en") as DestinyManifestLanguage;
    return await getDestinyManifestComponent(this.manifestComponentHttp, {
      language: lc,
      tableName,
      destinyManifest
    });
  }

  async getLinkedProfiles(bungieMembershipId: string) {
    return await getLinkedProfiles(this.platformHttp, {
      membershipId: bungieMembershipId,
      membershipType: 254
    }).then((res) => res.Response);
  }

  async getProfileProgressions(params: {
    destinyMembershipId: string;
    membershipType: BungieMembershipType;
  }) {
    return await getProfile(this.platformHttp, {
      destinyMembershipId: params.destinyMembershipId,
      membershipType: params.membershipType,
      components: [200, 202]
    }).then((res) => res.Response);
  }

  async claimSeasonPassReward(params: {
    characterId: string;
    membershipType: BungieMembershipType;
    rewardIndex: number;
    seasonHash: number;
    progressionHash: number;
  }) {
    const response: BungieNetResponse<unknown> = await this.platformHttp({
      baseUrl:
        "https://www.bungie.net/Platform/Destiny2/Actions/Seasons/ClaimReward/",
      method: "POST",
      contentType: "application/json",
      body: params
    });

    return response.Response;
  }
}
