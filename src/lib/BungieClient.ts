import type { BungieHttpProtocol } from "bungie-net-core";
import {
  AllDestinyManifestComponents,
  getDestinyManifestComponent,
} from "bungie-net-core/manifest";
import {
  getDestinyManifest,
  getLinkedProfiles,
  getProfile,
} from "bungie-net-core/endpoints/Destiny2";
import { BungieMembershipType, DestinyManifest } from "bungie-net-core/models";

export class BungieHttpClient {
  private platformHttp =
    (access_token?: string): BungieHttpProtocol =>
    async (config) => {
      const headers = new Headers({
        "X-API-Key": process.env.NEXT_PUBLIC_BUNGIE_API_KEY!,
      });

      if (access_token) {
        headers.set("Authorization", `Bearer ${access_token}`);
      }

      if (config.contentType) {
        headers.set("Content-Type", config.contentType);
      }

      const url =
        config.baseUrl + (config.searchParams ? `?${config.searchParams}` : "");

      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.Message, {
            cause: data,
          });
        }

        return data;
      } else {
        throw new Error(response.statusText, {
          cause: response,
        });
      }
    };

  private manifestComponentHttp: BungieHttpProtocol = async (config) => {
    const response = await fetch(config.baseUrl, {
      method: config.method,
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (response.headers.get("Content-Type")?.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message, {
          cause: data,
        });
      }

      return data;
    } else {
      throw new Error(response.statusText, {
        cause: response,
      });
    }
  };

  async getManifest() {
    return await getDestinyManifest(this.platformHttp()).then(
      (res) => res.Response
    );
  }

  async getManifestComponent<T extends keyof AllDestinyManifestComponents>(
    tableName: T,
    destinyManifest: DestinyManifest
  ) {
    return await getDestinyManifestComponent(this.manifestComponentHttp, {
      language: "en",
      tableName,
      destinyManifest,
    });
  }

  async getMembershipData(params: {
    accessToken: string;
    bungieMembershipId: string;
  }) {
    return await getLinkedProfiles(this.platformHttp(params.accessToken), {
      membershipId: params.bungieMembershipId,
      membershipType: -1,
      getAllMemberships: true,
    }).then((res) => res.Response);
  }

  async getProfileProgressions(params: {
    accessToken: string;
    destinyMembershipId: string;
    membershipType: BungieMembershipType;
  }) {
    return await getProfile(this.platformHttp(params.accessToken), {
      destinyMembershipId: params.destinyMembershipId,
      membershipType: params.membershipType,
      components: [202],
    }).then((res) => res.Response.characterProgressions.data!);
  }
}
