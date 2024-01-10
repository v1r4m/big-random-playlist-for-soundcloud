import Soundcloud from "soundcloud.ts";
//ref: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming

export async function GET(
) {
  const soundcloud = new Soundcloud({
    clientId: process.env.CLIENT_ID,
    oauthToken: process.env.OAUTH_TOKEN,
  });
  const playlist1 = await soundcloud.playlists.getV2('https://soundcloud.com/v1r4m/sets/werjx4kdffud');

  const playlist = await soundcloud.util.streamTrack("https://soundcloud.com/virtual-riot/emotionalrmx");
  return new Response(playlist);
}